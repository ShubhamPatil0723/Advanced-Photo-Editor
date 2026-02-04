import axios, { type AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { get } from 'lodash';
import { toast } from 'sonner';
import type { AppStore } from '@/redux/store';
import type { ApiError } from '@/types';

let interceptorsSetup = false;
let storeInstance: AppStore | null = null;

export const setupAxiosInterceptors = (store: AppStore) => {
  if (interceptorsSetup) return;
  interceptorsSetup = true;
  storeInstance = store;

  axios.defaults.timeout = 30000;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (storeInstance) {
        const state = storeInstance.getState();

        const token = get(state, 'auth.token', null);
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      return config;
    },
    (error: AxiosError) => {
      toast.error('Request configuration error');
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (!error.response) {
        toast.error('Network error. Please check your connection.');
        return Promise.reject(error);
      }

      const { status, data } = error.response;
      const errorMessage = get(data, 'message', 'An error occurred');

      switch (status) {
        case 400:
          toast.error(errorMessage);
          break;

        case 401:
          if (!originalRequest._retry) {
            originalRequest._retry = true;

            try {
              const refreshToken = localStorage.getItem('refresh_token');
              if (refreshToken) {
                const authApiUrl =
                  get(process.env, 'NEXT_PUBLIC_AUTH_API_URL') ||
                  get(process.env, 'NEXT_PUBLIC_API_URL') ||
                  '/api';

                const response = await axios.post(`${authApiUrl}/auth/refresh`, {
                  refreshToken,
                });

                const newToken = get(response, 'data.data.token');
                if (newToken) {
                  localStorage.setItem('auth_token', newToken);

                  if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                  }

                  return axios(originalRequest);
                }
              }
            } catch (refreshError) {
              localStorage.removeItem('auth_token');
              localStorage.removeItem('refresh_token');
              toast.error('Session expired. Please login again.');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          }
          break;

        case 403:
          // Forbidden
          toast.error('Access forbidden. Insufficient permissions.');
          window.location.href = '/forbidden';
          break;

        case 404:
          // Not Found
          toast.error('Resource not found');
          break;

        case 429:
          // Too Many Requests
          toast.error('Too many requests. Please try again later.');
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server Errors
          toast.error('Server error. Please try again later.');
          break;

        default:
          // Other errors
          toast.error(errorMessage);
          break;
      }

      return Promise.reject(error);
    }
  );
};

export const getApiUrl = (): string => {
  return get(process.env, 'NEXT_PUBLIC_API_URL') || '/api';
};

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = get(error, 'response.data') as ApiError | undefined;
    return get(apiError, 'message') || get(error, 'message') || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export default axios;
