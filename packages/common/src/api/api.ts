import { getApiClient } from "./apiClient";

export const Get = async (endpoint: string) => {
  try {
    const resp = await getApiClient().get(endpoint);
    return resp?.data;
  } catch (e) {
    console.log('api err', e)
  }
};
export const GetOne = async (endpoint: string, id: number) => {
  try {
    const resp = await getApiClient().get(`${endpoint}/${id}`);
    return resp?.data;
  } catch (e) {
    console.log('api err', e)
  }
};

export const Post = async (endpoint: string, data: any) => {
  return await getApiClient().post(endpoint, data);
};

export const Put = async (endpoint: string, data: any) => {
  return await getApiClient().put(endpoint, data);
};

export const Patch = async (endpoint: string, data: any) => {
  return await getApiClient().patch(endpoint, data);
};

export const Delete = async (endpoint: string,) => {
  return await getApiClient().delete(endpoint);
};
