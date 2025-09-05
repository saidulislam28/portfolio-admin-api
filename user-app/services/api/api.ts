import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseUrl } from "./endpoints";


const getUserToken = async () => {
  const userData = await AsyncStorage.getItem('user');
  const data = userData ? JSON.parse(userData) : null
  return data?.token ?? '';
}

const request = async (method: string, endpoint: string, data = null) => {

  const token = await getUserToken() ?? '';

  try {
    const url = `${baseUrl}/${endpoint}`;
    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    if (!response.ok) {
      console.error(`Error: ${response.status}`, result);
      throw new Error(result.message || 'Something went wrong');
    }

    return result;
  } catch (error) {
    console.error('Request Failed:', error?.message);
    throw error;
  }
};

export const Get = async (endpoint: string) => {
  return await request('GET', endpoint);
};

export const GetOne = async (endpoint: string, id: number) => {
  return await request('GET', `${endpoint}/${id}`);
};

export const Post = async (endpoint: string, data: any) => {
  return await request('POST', endpoint, data);
};

export const Put = async (endpoint: string, id: number, data: any) => {
  return await request('PUT', `${endpoint}/${id}`, data);
};

export const Patch = async (endpoint: string, id: number, data: any) => {
  return await request('PATCH', `${endpoint}/${id}`, data);
};

export const Delete = async (endpoint: string, id: number) => {
  return await request('DELETE', `${endpoint}/${id}`);
};
