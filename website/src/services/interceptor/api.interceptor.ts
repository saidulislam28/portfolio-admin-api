import { API_URL, USER_SECRET_KEY } from "@/config/config";
import axios, { AxiosError, AxiosResponse } from "axios";

var CryptoJS = require("crypto-js");

axios.defaults.baseURL = API_URL + "/api/v1";

const authApi = axios.create({
  baseURL: API_URL + "/api/v1",
});

authApi.interceptors.request.use(
  async (config: any) => {
    const setedUserInfo = localStorage.getItem("userInfo");
    const decryptUserInfo = CryptoJS.AES.decrypt(
      setedUserInfo,
      USER_SECRET_KEY
    );
    const decryptUserInfox = decryptUserInfo.toString(CryptoJS.enc.Utf8);
    const userInfo = JSON.parse(decryptUserInfox);

    const access_token = userInfo.token;

    if (config.headers) {
      config.headers.Authorization = `Bearer ${access_token}`;
    } else {
      config.headers = {
        Authorization: `Bearer ${access_token}`,
      };
    }

    return config;
  },
  (err) => {
    console.error(err);
    return Promise.reject(err);
  }
);

const apiRequest = <T>(url: string, config: any): Promise<AxiosResponse<T>> =>
  axios.request<T>({
    url,
    ...config,
  });

export { apiRequest, authApi };
