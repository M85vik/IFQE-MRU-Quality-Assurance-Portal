import { useState } from 'react';
import apiClient from '../api/axiosConfig';

const useSecureDownloader = () => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    const downloadFile = async (fileKey, fileName = 'download') => {
        if (!fileKey) {
            console.error("Download attempt failed: No file key provided.");
            setError('No file to download.');
            return;
        }
        
        setIsDownloading(true);
        setError(null);
        
        try {
            const { data } = await apiClient.get(`/files/download-url?fileKey=${fileKey}`);
            
            if (data && data.downloadUrl) {
                
                const link = document.createElement('a');
                link.href = data.downloadUrl;

                const name = fileKey.split('/').pop() || fileName;
                link.setAttribute('download', name);

                document.body.appendChild(link);

                link.click();

                document.body.removeChild(link);

            } else {
                throw new Error('Received an invalid download link from the server.');
            }

        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Download failed.';
            console.error("Download failed:", errorMessage);
            setError(errorMessage);
            alert(`Download failed: ${errorMessage}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return { downloadFile, isDownloading, error };
};

export default useSecureDownloader;