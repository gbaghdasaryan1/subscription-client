import axios from "axios";
import { SecureStorageService } from "./secure-storage-service";

export const API_BASE = "http://172.20.10.6:5050";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStorageService.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor - Enhanced error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Parse and log error silently (without showing alert)
    // const appError = handleErrorSilent(error);

    // Handle 401 - clear auth and let screens handle navigation
    // if (appError.statusCode === 401) {
    //   try {
    //     await SecureStorageService.clearAll();
    //     console.warn("401 Unauthorized - cleared auth storage");
    //   } catch (clearError) {
    //     console.error("Error clearing storage:", clearError);
    //   }
    // }

    // Reject with the original error so calling code can handle it
    return Promise.reject(error);
  },
);

export default api;
