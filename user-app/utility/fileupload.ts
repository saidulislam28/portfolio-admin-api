import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { API_FILE_UPLOAD } from '~/services/api/endpoints';

const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    const actualFile = file.originFileObj || file; // 👈 fallback for non-AntD uploads

    formData.append('file', actualFile);
    formData.append('name', actualFile.name);
    setUploading(true);

    try {
      const response = await axios.post(API_FILE_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        const url = response.data.url;
        message.success('File uploaded successfully');
        onSuccess(response, actualFile);
        return url;
      } else {
        message.error('Upload failed');
        onError(new Error('Upload failed'));
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    handleUpload,
  };
};

export default useFileUpload;