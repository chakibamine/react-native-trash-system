import axios from 'axios';
import Constants from 'expo-constants';

// Get the API URL from environment variables or app config
const API_URL = Constants.expoConfig?.extra?.API_URL || process.env.API_URL;

if (!API_URL) {
  console.error('API_URL is not configured. Please set it in app.json or .env file');
}

// Create axios instance with default config
const client = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor for logging and error handling
client.interceptors.request.use(
  (config) => {
    // Log the full URL being requested
    const url = config.baseURL && config.url ? `${config.baseURL}${config.url}` : 'URL not available';
    console.log('Making request to:', url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', error.request);
      if (!API_URL) {
        console.error('API_URL is not configured. Please check your configuration.');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default client; 