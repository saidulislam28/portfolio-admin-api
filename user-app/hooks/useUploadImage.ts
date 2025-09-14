// hooks/useImageUpload.ts
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

    const uploadImage = async (imageUri: string, options?: UploadImageOptions): Promise<string> => {
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

            formData.append("name", "profile_image");

            const baseURL = Constants.expoConfig?.extra?.apiBaseUrl;
            // const API_UPLOAD_IMAGE = "/api/upload/image"; // Adjust this to your endpoint
            const fullURL = `${baseURL}/${API_COMMON.API_UPLOAD_IMAGE}`;

            console.log("full url for upload image", fullURL)

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
            const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
            setError(errorMessage);
            console.error("Image upload error:", err);
            console.error("Image upload resposne error:", err.response);
            console.error("Image upload message error:", err.message);
            throw new Error(errorMessage);
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