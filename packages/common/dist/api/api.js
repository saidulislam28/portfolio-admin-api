import { getApiClient } from "./apiClient";
export const Get = async (endpoint) => {
    try {
        const resp = await getApiClient().get(endpoint);
        return resp?.data;
    }
    catch (e) {
        console.log('api err', e);
    }
};
export const GetOne = async (endpoint, id) => {
    try {
        const resp = await getApiClient().get(`${endpoint}/${id}`);
        return resp?.data;
    }
    catch (e) {
        console.log('api err', e);
    }
};
export const Post = async (endpoint, data) => {
    return await getApiClient().post(endpoint, data);
};
export const Put = async (endpoint, data) => {
    return await getApiClient().put(endpoint, data);
};
export const Patch = async (endpoint, data) => {
    return await getApiClient().patch(endpoint, data);
};
export const Delete = async (endpoint) => {
    return await getApiClient().delete(endpoint);
};
