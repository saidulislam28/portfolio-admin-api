import axios from 'axios';
let apiClient = null;
export function initApiClients(initconfig) {
    apiClient = axios.create({ baseURL: initconfig.baseUrl });
    apiClient.interceptors.request.use(async (config) => {
        config.headers['ngrok-skip-browser-warning'] = 'true'; // To skip ngrok verification page while testing locally
        if (initconfig.tokenProvider) {
            try {
                const token = await initconfig.tokenProvider();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            catch (err) {
                console.error('Token fetch failed:', err);
            }
        }
        return config;
    }, (error) => Promise.reject(error));
}
export function getApiClient() {
    if (!apiClient) {
        throw new Error('api client not initialized. Call initApiClients() first.');
    }
    return apiClient;
}
