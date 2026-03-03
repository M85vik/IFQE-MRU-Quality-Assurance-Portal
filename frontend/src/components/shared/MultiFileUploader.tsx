/**
 * @fileoverview Multi-file uploader component for evidence documents.
 * Supports uploading multiple files with individual delete functionality.
 */

import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import apiClient from '../../api/axiosConfig';
import { UploadCloud, File as FileIcon, X, AlertTriangle, Lock, Loader2, Eye } from 'lucide-react';

interface MultiFileUploaderProps {
  submissionId: string;
  identifier: Record<string, any>;
  fileKeys: string[];
  onFileAdded: (fileKey: string) => void;
  onFileRemoved: (fileKey: string) => void;
  isDisabled?: boolean;
  maxFiles?: number;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

const MultiFileUploader: React.FC<MultiFileUploaderProps> = ({
  submissionId,
  identifier,
  fileKeys = [],
  onFileAdded,
  onFileRemoved,
  isDisabled = false,
  maxFiles = 10,
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [removingKeys, setRemovingKeys] = useState<Set<string>>(new Set());
  const [previewingKeys, setPreviewingKeys] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  const handleUpload = async (file: File) => {
    const uploadId = `${Date.now()}-${Math.random()}`;
    
    setUploadingFiles(prev => [...prev, { id: uploadId, name: file.name, progress: 0 }]);
    setError('');

    try {
      // Get presigned URL
      const { data: { uploadUrl, fileKey } } = await apiClient.post('/files/upload-url', {
        submissionId,
        fileType: file.type,
        ...identifier,
        isMultiEvidence: true,
      });

      // Upload to S3
      await axios.put(uploadUrl, file, {
        headers: { 'Content-Type': file.type },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadingFiles(prev =>
              prev.map(f => f.id === uploadId ? { ...f, progress: percentCompleted } : f)
            );
          }
        },
      });

      // Remove from uploading list and add to files
      setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
      onFileAdded(fileKey);
    } catch (err) {
      setUploadingFiles(prev => prev.filter(f => f.id !== uploadId));
      setError('Upload failed. Please try again.');
    }
  };

  const handleRemove = async (fileKey: string) => {
    if (isDisabled) return;
    
    setRemovingKeys(prev => new Set(prev).add(fileKey));
    setError('');

    try {
      onFileRemoved(fileKey);
    } catch (err) {
      setError('Failed to remove file. Please try again.');
    } finally {
      setRemovingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileKey);
        return newSet;
      });
    }
  };

  const handlePreview = async (fileKey: string) => {
    setPreviewingKeys(prev => new Set(prev).add(fileKey));
    setError('');

    try {
      const { data } = await apiClient.get(`/files/download-url?fileKey=${encodeURIComponent(fileKey)}`);
      if (data?.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        setError('Could not generate preview link.');
      }
    } catch (err) {
      setError('Failed to preview file. Please try again.');
    } finally {
      setPreviewingKeys(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileKey);
        return newSet;
      });
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (isDisabled) return;

    const remainingSlots = maxFiles - fileKeys.length - uploadingFiles.length;
    const filesToUpload = acceptedFiles.slice(0, remainingSlots);

    filesToUpload.forEach(file => {
      if (file.size > 50 * 1024 * 1024) {
        setError(`File "${file.name}" is too large. Maximum size is 50MB.`);
        return;
      }
      handleUpload(file);
    });

    if (acceptedFiles.length > remainingSlots) {
      setError(`Maximum ${maxFiles} files allowed. Some files were not uploaded.`);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isDisabled || uploadingFiles.length > 0 || fileKeys.length >= maxFiles,
    multiple: true,
  });

  if (isDisabled && fileKeys.length === 0) {
    return (
      <div className="w-full p-6 border-2 border-dashed border-border rounded-lg bg-muted">
        <div className="flex flex-col items-center justify-center text-center">
          <Lock className="w-10 h-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground font-medium">Editing is locked</p>
          <p className="text-xs text-muted-foreground">This submission is not in a draft state.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Existing Files */}
      {fileKeys.length > 0 && (
        <div className="space-y-2">
          {fileKeys.map((fileKey, index) => (
            <div
              key={fileKey}
              className={`p-3 border rounded-lg flex items-center justify-between ${
                isDisabled ? 'bg-muted' : 'bg-green-500/10 border-green-500/20'
              }`}
            >
              <div className="flex items-center space-x-2 overflow-hidden flex-1">
                <FileIcon className={`h-5 w-5 flex-shrink-0 ${isDisabled ? 'text-muted-foreground' : 'text-green-600'}`} />
                <span className={`text-sm font-medium ${isDisabled ? 'text-muted-foreground' : 'text-green-800'}`}>
                  Evidence {index + 1} uploaded.
                </span>
              </div>
              <div className="flex items-center space-x-1 flex-shrink-0">
                {/* Preview Button */}
                <button
                  onClick={() => handlePreview(fileKey)}
                  disabled={previewingKeys.has(fileKey)}
                  className="text-blue-600 opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-blue-100 disabled:opacity-30"
                  title="Preview file"
                >
                  {previewingKeys.has(fileKey) ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
                {/* Delete Button */}
                {!isDisabled && (
                  <button
                    onClick={() => handleRemove(fileKey)}
                    disabled={removingKeys.has(fileKey)}
                    className="text-destructive opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-destructive/10 disabled:opacity-30"
                    title="Remove file"
                  >
                    {removingKeys.has(fileKey) ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <X size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map(file => (
            <div key={file.id} className="p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2 overflow-hidden">
                  <Loader2 className="h-5 w-5 text-blue-600 animate-spin flex-shrink-0" />
                  <span className="text-sm font-medium text-blue-800 truncate">{file.name}</span>
                </div>
                <span className="text-sm text-blue-600">{file.progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${file.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dropzone - only show if not at max files and not disabled */}
      {!isDisabled && fileKeys.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'
          } ${uploadingFiles.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-center">
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              MAX. 50MB per file • {fileKeys.length}/{maxFiles} files uploaded
            </p>
          </div>
        </div>
      )}

      {/* Max files reached message */}
      {!isDisabled && fileKeys.length >= maxFiles && (
        <div className="p-4 border rounded-lg bg-amber-50 border-amber-200 text-center">
          <p className="text-sm text-amber-800">
            Maximum {maxFiles} files reached. Remove a file to upload more.
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-xs text-destructive flex items-center space-x-1">
          <AlertTriangle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default MultiFileUploader;
