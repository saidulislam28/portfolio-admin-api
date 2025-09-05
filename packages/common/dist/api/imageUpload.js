import { getApiClient } from "./apiClient";
import mime from 'mime';
/**
 * Upload an image to the attachments endpoint
 * @param uri Local file URI of the image
 */
export const uploadImageFromApp = async (uri, name = 'file') => {
    const formData = new FormData();
    const uriParts = uri.split('/');
    const fileName = uriParts[uriParts.length - 1];
    const fileType = fileName.split('.').pop();
    formData.append('file', {
        uri,
        name: uri.split('/').pop(),
        type: mime.getType(uri),
    });
    formData.append("name", name);
    console.log('uploadImageFromApp', formData);
    console.log("Uploading with formData structure:", {
        uri: uri,
        name: uri.split('/').pop(),
        type: mime.getType(uri),
    });
    const resp = await getApiClient().post('attachments/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
        },
    });
    console.log('respsss', resp);
    return resp.data.url;
};
