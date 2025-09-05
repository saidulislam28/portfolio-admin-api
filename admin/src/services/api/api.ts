import axios from 'axios';

import { SERVER_URL } from '~/configs';
import { PERSIST_STORE_NAME } from '~/constants/app.constant';
import store from '~/store';
import deepParseJson from '~/utility/deepParseJson';

const apiClient = axios.create({
  baseURL: `${SERVER_URL}/api/v1`,
});

apiClient.interceptors.request.use(
  (config) => {
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME);
    const persistData = deepParseJson(rawPersistData);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let accessToken = (persistData as any).auth.session.token;

    if (!accessToken) {
      const { auth } = store.getState();
      accessToken = auth.session.token;
    }

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const get = async (endpoint: string) => {
  return await apiClient.get(endpoint);
};
export const getWithSearchParams = async (endpoint: string, params = {}) => {
  return await apiClient.get(endpoint, { params });
};
export const getOne = async (endpoint: string, id) => {
  return await apiClient.get(`${endpoint}/${id}`);
};

export const post = async (endpoint: string, data: any) => {
  return await apiClient.post(endpoint, data);
};

export const patch = async (endpoint: string, data: any) => {
  return await apiClient.patch(endpoint, data);
};
export const patchApprove = async (endpoint: string) => {
  return await apiClient.patch(endpoint);
};

export const deleteApi = async (endpoint: string) => {
  return await apiClient.delete(endpoint);
};
export const multiDeleteCageHomeApi = async (endpoint: string, data) => {
  return await apiClient.delete(endpoint, {
    data,
  });
};
// export const multiPublishCareHomes = async (endpoint: string, data) => {
//   return await apiClient.put(endpoint, data);
// };
// export const multiVerifiedCareHomes = async (endpoint: string, data) => {
//   return await apiClient.put(endpoint, data);
// };

export const put = async (endpoint: string, data: any) => {
  return await apiClient.put(endpoint, data);
};
