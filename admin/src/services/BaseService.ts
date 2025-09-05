import axios from 'axios';

import { SERVER_URL } from '~/configs';
import { PERSIST_STORE_NAME } from '~/constants/app.constant';
import deepParseJson from '~/utility/deepParseJson';

import store, { signOutSuccess } from '../store';

const unauthorizedCode = [401];

const BaseService = axios.create({
  timeout: 60000,
  baseURL: `${SERVER_URL}/api/v1`,
  // baseURL: 'http://localhost:8000/api/v1',
});

BaseService.interceptors.request.use(
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

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      store.dispatch(signOutSuccess());
    }

    return Promise.reject(error);
  },
);

export default BaseService;
