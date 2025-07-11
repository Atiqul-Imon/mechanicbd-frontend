import axios, { AxiosError, AxiosResponse } from 'axios';

export const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:5000/api'
  : process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : 'https://mechanicbd-backend.onrender.com/api';

// Utility function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

const removeLocalStorageItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing localStorage:', error);
  }
};

// Create axios instance with better configuration
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
  withCredentials: false, // Don't send cookies automatically
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    // Add CSRF protection header if needed
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // Add authorization token if available
    const token = getLocalStorageItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.status);
    }
    return response;
  },
  (error: AxiosError) => {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        status: error.response?.status,
        message: error.message,
        data: error.response?.data
      });
    }

    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid tokens
      removeLocalStorageItem('token');
      removeLocalStorageItem('user');
      removeLocalStorageItem('role');
      
      // Redirect to login if on client-side
      if (typeof window !== 'undefined') {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle server errors
    if (error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }

    return Promise.reject(error);
  }
);

// Helper functions for common HTTP methods
export const get = async (url: string, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const post = async (url: string, data = {}, config = {}) => {
  try {
    const response = await api.post(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const put = async (url: string, data = {}, config = {}) => {
  try {
    const response = await api.put(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const patch = async (url: string, data = {}, config = {}) => {
  try {
    const response = await api.patch(url, data, config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const del = async (url: string, config = {}) => {
  try {
    const response = await api.delete(url, config);
    return response;
  } catch (error) {
    throw error;
  }
};

// Utility function to handle API errors consistently
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

// Utility function to validate API responses
export const validateApiResponse = (response: any): boolean => {
  return response && 
         response.data && 
         response.status >= 200 && 
         response.status < 300;
};

// Booking API helpers
export const getBookingById = async (bookingId: string) => {
  const response = await get(`/bookings/${bookingId}`);
  if (!validateApiResponse(response)) throw new Error('Failed to fetch booking');
  return response.data;
};

export const cancelBooking = async (bookingId: string) => {
  const response = await post(`/bookings/${bookingId}/cancel`);
  if (!validateApiResponse(response)) throw new Error('Failed to cancel booking');
  return response.data;
};

export const requestRefund = async (bookingId: string) => {
  const response = await post(`/bookings/${bookingId}/refund`);
  if (!validateApiResponse(response)) throw new Error('Failed to request refund');
  return response.data;
};

export const requestReschedule = async (bookingId: string) => {
  const response = await post(`/bookings/${bookingId}/reschedule`);
  if (!validateApiResponse(response)) throw new Error('Failed to request reschedule');
  return response.data;
};

// Utility to get current full path (for redirect)
export const getCurrentPathWithQuery = () => {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname + window.location.search + window.location.hash;
};

export default api;