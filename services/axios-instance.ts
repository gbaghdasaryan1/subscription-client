import axios from "axios";
import { SecureStorageService } from "./secure-storage-service";

export const API_BASE = "http://172.20.10.1:5050";

const api = axios.create({
  baseURL: API_BASE,
  // timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStorageService.getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default api;
