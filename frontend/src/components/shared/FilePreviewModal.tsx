import React, { useState, useEffect } from 'react';
import { X, Download, FileSpreadsheet, FileText, Image as ImageIcon, File, Loader2, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import apiClient from '../../api/axiosConfig';

interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileKey: string | null;
  submissionId?: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  isOpen,
  onClose,
  fileKey,
  submissionId
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [excelSheets, setExcelSheets] = useState<{ name: string; data: any[][] }[]>([]);
  const [activeSheetIndex, setActiveSheetIndex] = useState(0);

  const fileName = fileKey ? fileKey.split('/').pop() || 'file' : '';
  const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

  const isExcel = ['xlsx', 'xls', 'csv'].includes(fileExt);
  const isPdf = fileExt === 'pdf';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(fileExt);

  useEffect(() => {
    if (!isOpen || !fileKey) {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
        setBlobUrl(null);
      }
      setExcelSheets([]);
      setError(null);
      return;
    }

    let isMounted = true;
    let createdUrl: string | null = null;

    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isExcel) {
          // Fetch ArrayBuffer for Excel parsing
          const response = await apiClient.get('/files/view-file', {
            params: { fileKey, submissionId },
            responseType: 'arraybuffer'
          });

          if (!isMounted) return;

          const workbook = XLSX.read(response.data, { type: 'array' });
          const sheets = workbook.SheetNames.map(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];
            return { name: sheetName, data: rows };
          });

          setExcelSheets(sheets);
          setActiveSheetIndex(0);

          // Also create blob for optional download
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          createdUrl = URL.createObjectURL(blob);
          setBlobUrl(createdUrl);
        } else if (isPdf || isImage) {
          // Fetch as Blob for PDF / Image viewing
          const response = await apiClient.get('/files/view-file', {
            params: { fileKey, submissionId },
            responseType: 'blob'
          });

          if (!isMounted) return;

          const blob = new Blob([response.data], {
            type: isPdf ? 'application/pdf' : response.headers['content-type'] || 'image/png'
          });
          createdUrl = URL.createObjectURL(blob);
          setBlobUrl(createdUrl);
        } else {
          // Other file types: fetch as blob for download option
          const response = await apiClient.get('/files/view-file', {
            params: { fileKey, submissionId },
            responseType: 'blob'
          });
          if (!isMounted) return;
          createdUrl = URL.createObjectURL(response.data);
          setBlobUrl(createdUrl);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error('File preview error:', err);
        setError(err.response?.data?.message || err.message || 'Could not load file for preview.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [isOpen, fileKey, submissionId, isExcel, isPdf, isImage]);

  if (!isOpen || !fileKey) return null;

  const handleManualDownload = () => {
    if (!blobUrl) return;
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileBadge = () => {
    if (isExcel) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
          <FileSpreadsheet size={13} /> Excel Sheet
        </span>
      );
    }
    if (isPdf) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
          <FileText size={13} /> PDF Document
        </span>
      );
    }
    if (isImage) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
          <ImageIcon size={13} /> Image
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-600 border border-gray-500/20">
        <File size={13} /> {fileExt.toUpperCase()}
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
          <div className="flex items-center gap-3 overflow-hidden pr-2">
            {getFileBadge()}
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate" title={fileName}>
              {fileName}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {blobUrl && (
              <button
                onClick={handleManualDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition"
                title="Download file"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition"
              title="Close viewer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Excel Sheet Tabs (if multi-sheet) */}
        {isExcel && excelSheets.length > 1 && (
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-800/40 overflow-x-auto">
            {excelSheets.map((sheet, idx) => (
              <button
                key={sheet.name}
                onClick={() => setActiveSheetIndex(idx)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition whitespace-nowrap ${
                  activeSheetIndex === idx
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sheet.name} ({sheet.data.length} rows)
              </button>
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-auto bg-slate-100 dark:bg-slate-950 p-2 sm:p-4 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Opening file preview...
              </p>
            </div>
          ) : error ? (
            <div className="max-w-md p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">{error}</p>
              {blobUrl && (
                <button
                  onClick={handleManualDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  <Download size={16} /> Download File Instead
                </button>
              )}
            </div>
          ) : isPdf && blobUrl ? (
            <iframe
              src={blobUrl}
              title={fileName}
              className="w-full h-full rounded-lg shadow-inner bg-white border border-slate-300 dark:border-slate-800"
            />
          ) : isImage && blobUrl ? (
            <div className="w-full h-full flex items-center justify-center p-2">
              <img
                src={blobUrl}
                alt={fileName}
                className="max-h-full max-w-full object-contain rounded-lg shadow-md"
              />
            </div>
          ) : isExcel && excelSheets.length > 0 ? (
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg shadow border border-slate-200 dark:border-slate-800 overflow-auto">
              {excelSheets[activeSheetIndex]?.data?.length ? (
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-3 py-2 border-b border-r border-slate-200 dark:border-slate-700 text-slate-400 font-mono w-12 text-center">
                        #
                      </th>
                      {excelSheets[activeSheetIndex].data[0]?.map((col: any, colIdx: number) => (
                        <th
                          key={colIdx}
                          className="px-3 py-2 border-b border-r border-slate-200 dark:border-slate-700 font-semibold whitespace-nowrap max-w-xs truncate"
                          title={String(col ?? '')}
                        >
                          {String(col ?? '') || `Col ${colIdx + 1}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {excelSheets[activeSheetIndex].data.slice(1).map((row: any[], rowIdx: number) => (
                      <tr
                        key={rowIdx}
                        className="hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-colors"
                      >
                        <td className="px-3 py-1.5 border-r border-slate-200 dark:border-slate-800 text-slate-400 font-mono text-center bg-slate-50 dark:bg-slate-850">
                          {rowIdx + 1}
                        </td>
                        {excelSheets[activeSheetIndex].data[0]?.map((_: any, colIdx: number) => {
                          const cellVal = row[colIdx];
                          return (
                            <td
                              key={colIdx}
                              className="px-3 py-1.5 border-r border-slate-100 dark:border-slate-800/50 text-slate-800 dark:text-slate-200 whitespace-nowrap max-w-md truncate"
                              title={cellVal !== undefined && cellVal !== null ? String(cellVal) : ''}
                            >
                              {cellVal !== undefined && cellVal !== null && cellVal !== '' ? (
                                String(cellVal)
                              ) : (
                                <span className="text-slate-300 dark:text-slate-700">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-sm text-slate-500">This sheet is empty.</div>
              )}
            </div>
          ) : (
            <div className="max-w-md p-6 bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <File className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Direct in-browser preview is not supported for <strong>.{fileExt}</strong> files.
              </p>
              {blobUrl && (
                <button
                  onClick={handleManualDownload}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  <Download size={16} /> Download File
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
