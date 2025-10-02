import { useState } from 'react';
import Constants from 'expo-constants';
import { API_COMMON } from '@sm/common';

interface UploadImageOptions {
    token?: string;
    fieldName?: string;
}

export const useImageUpload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (imageUri: string, options?: UploadImageOptions) => {
        const { token, fieldName = 'file' } = options || {};

        setIsLoading(true);
        setError(null);

        try {
            const fileName = imageUri.split("/").pop() || "image.jpg";
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : "image/jpeg";

            const formData = new FormData();
            formData.append(fieldName, {
                uri: imageUri,
                name: fileName,
                type: type,
            } as any);

            const baseURL = Constants.expoConfig?.extra?.apiBaseUrl;
            const fullURL = `${baseURL}/${API_COMMON.API_UPLOAD_IMAGE}`;


            const response = await fetch(fullURL, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Upload failed:", errorText);
                throw new Error(`Upload failed: ${response.status}`);
            }

            const result = await response.json();

            if (result.url) {
                return result.url;
            } else {
                throw new Error(result.message || "Upload failed - no URL returned");
            }
        } catch (err: any) {
            console.error("Image upload error:", {
                message: err.message,
                stack: err.stack
            });
            const errorMessage = err.message || "Failed to upload image";
            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const resetError = () => setError(null);

    return {
        uploadImage,
        isLoading,
        error,
        resetError,
    };
};


