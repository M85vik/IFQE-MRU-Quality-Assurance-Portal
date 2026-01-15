import { useState } from 'react';
import apiClient from '../api/axiosConfig';
import toast from 'react-hot-toast';

const useArchiveDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadArchive = async (submissionId: string) => {
    setIsDownloading(true);
    try {
      const { data } = await apiClient.get(
        `/archives/submissions/${submissionId}/download`
      );

      if (!data?.downloadUrl) {
        throw new Error('Invalid download URL');
      }

      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.setAttribute('download', 'submission-archive.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Archive download failed'
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadArchive, isDownloading };
};

export default useArchiveDownloader;
