import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import apiClient from '../../api/axiosConfig';
import { UploadCloud, File as FileIcon, X, AlertTriangle, Lock } from 'lucide-react';
import Spinner from './Spinner';


interface FileUploaderProps {
  onUploadSuccess: (fileKey: string) => void;
  onRemove: (fileKey: string) => Promise<void>;
  initialFileKey?: string | null;
  isDisabled?: boolean;
  submissionId: string;
  identifier: Record<string, any>;
}


const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, onRemove, initialFileKey, isDisabled = false, submissionId, identifier }) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentFileKey, setCurrentFileKey] = useState(initialFileKey);

    useEffect(() => {
        setCurrentFileKey(initialFileKey);
    }, [initialFileKey]);

    const handleUpload = async (fileToUpload: File) => {
        if (isDisabled) return;
        setIsProcessing(true);
        setProgress(0);
        setError('');
        try {
            const { data: { uploadUrl, fileKey } } = await apiClient.post('/files/upload-url', { submissionId, fileType: fileToUpload.type, ...identifier });
            await axios.put(uploadUrl, fileToUpload, {
                headers: { 'Content-Type': fileToUpload.type },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setProgress(percentCompleted);
                    }
                },
            });
            setCurrentFileKey(fileKey);
            onUploadSuccess(fileKey);
        } catch (err) {
            setError('Upload failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const onDrop = (acceptedFiles: File[]) => {
        if (isDisabled || acceptedFiles.length === 0) return;
        const selectedFile = acceptedFiles[0];
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File is too large. Maximum size is 10MB.');
            return;
        }
        setError('');
        handleUpload(selectedFile);
    };
    
    const handleRemoveClick = async () => {
        if (isDisabled || !currentFileKey || !onRemove) return;
        setIsProcessing(true);
        setError('');
        try {
            await onRemove(currentFileKey);
            setCurrentFileKey(null);
        } catch (err) {
            setError("Could not remove the file. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: isProcessing || isDisabled, multiple: false });
    
    if (isProcessing) {
        return (
            <div className="w-full p-4 border rounded-lg text-center bg-muted">
                <Spinner size="sm" />
                <p className="text-sm text-muted-foreground mt-2">{progress > 0 ? `Uploading... ${progress}%` : 'Processing...'}</p>
                {progress > 0 && (
                    <div className="w-full bg-secondary rounded-full h-2.5 mt-2">
                        <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
        );
    }

    if (currentFileKey) {
        return (
            <div className={`w-full p-3 border rounded-lg flex items-center justify-between ${isDisabled ? 'bg-muted' : 'bg-green-500/10 border-green-500/20'}`}>
                <div className="flex items-center space-x-2 overflow-hidden">
                    <FileIcon className={`h-5 w-5 flex-shrink-0 ${isDisabled ? 'text-muted-foreground' : 'text-green-600'}`} />
                    <span className={`text-sm font-medium truncate ${isDisabled ? 'text-muted-foreground' : 'text-green-800'}`}>File uploaded.</span>
                </div>
                {!isDisabled && (
                    <button onClick={handleRemoveClick} className="text-destructive opacity-70 hover:opacity-100 p-1 rounded-full hover:bg-destructive/10 flex-shrink-0">
                        <X size={18} />
                    </button>
                )}
            </div>
        );
    }

    if (isDisabled) {
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
        <div className="w-full">
            <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-input hover:border-primary/50'}`}>
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-muted-foreground">MAX. 10MB</p>
                </div>
            </div>
            {error && (
                <div className="mt-2 text-xs text-destructive flex items-center space-x-1">
                    <AlertTriangle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};

export default FileUploader;