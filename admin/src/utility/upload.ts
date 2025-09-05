export const getUrlFromUploadComponent = (formValues, fileInputName) => {
    if (formValues[fileInputName] && Array.isArray(formValues[fileInputName])) {
        const file = formValues[fileInputName][0];
        if (file && file.status === 'done' && file.response && file.response.success && file.response?.data?.url) {
            return file.response?.data?.url
        } else if (file && file.thumbUrl) {
            return file.thumbUrl;
        }
    }

    return null;
}

export const getUrlFromUploadComponentMultiple = (formValues, fileInputName) => {
    if (formValues[fileInputName] && Array.isArray(formValues[fileInputName])) {
        const files = formValues[fileInputName]?.map(item => {
            if (item && item.status === 'done' && item.response && item.response.success && item.response?.data?.url) {
                return item.response?.data?.url
            }
        });
        return files
    }
    return null;
}
