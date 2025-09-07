import { useState } from 'react';
import axios from 'axios';
import { API_COMMON } from '@sm/common';
import Constants from "expo-constants";


const useFileUpload = () => {

  const baseUrl = Constants.expoConfig?.extra?.apiBaseUrl || ""

  const [uploading, setUploading] = useState(false);

  const handleUpload = async (options) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    const actualFile = file.originFileObj || file; // 👈 fallback for non-AntD uploads

    formData.append('file', actualFile);
    formData.append('name', actualFile.name);
    setUploading(true);

    try {
      const response = await axios.post(`${baseUrl}/${API_COMMON.API_UPLOAD_IMAGE}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.url) {
        const url = response.data.url;
        // message.success('File uploaded successfully');
        onSuccess(response, actualFile);
        return url;
      } else {
        // message.error('Upload failed');
        onError(new Error('Upload failed'));
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      // message.error('Upload failed');
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