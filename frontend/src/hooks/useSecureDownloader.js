import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import toast from 'react-hot-toast';
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

            // download fix 
            // const { data } = await apiClient.get(`/files/download-url?fileKey=${fileKey}`);
            const { data } = await apiClient.get(`/files/download-url?fileKey=${encodeURIComponent(fileKey)}`);
            if (data && data.downloadUrl) {



                const link = document.createElement('a');
                link.href = data.downloadUrl;

                const name = fileKey.split('/').pop() || fileName;

                const isPreviewable = /\.(pdf|png|jpe?g|webp|gif|svg)$/i.test(name);
              
                if(isPreviewable) {
                    link.target = '_blank';

                }
              
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
            // alert(`Download failed: ${errorMessage}`);
            toast.error(`Download failed: ${errorMessage}`)
        } finally {
            setIsDownloading(false);
        }
    };

    return { downloadFile, isDownloading, error };
};

export default useSecureDownloader;