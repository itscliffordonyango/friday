import axios from 'axios';
import { Cache } from 'memory-cache';

const cache = new Cache();
const API_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

// Centralized error handling
const handleError = (error) => {
    if (error.response) {
        console.error('API Error:', error.response.data);
        throw new Error(`API Error: ${error.response.status}`);
    } else if (error.request) {
        console.error('No response from API:', error.request);
        throw new Error('No response from API');
    } else {
        console.error('Error setting up API call:', error.message);
        throw new Error('Error setting up API call');
    }
};

// Retry logic
const fetchWithRetry = async (url, options, retries = MAX_RETRIES) => {
    try {
        const response = await apiClient(url, options);
        return response.data;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying... (${MAX_RETRIES - retries + 1})`);
            return fetchWithRetry(url, options, retries - 1);
        }
        handleError(error);
    }
};

// Get data with caching
const getCachedData = async (url) => {
    const cacheKey = `cache_${url}`;
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        console.log('Returning cached data');
        return cachedResponse;
    }

    const response = await fetchWithRetry(url);
    cache.put(cacheKey, response, 300000); // Cache for 5 minutes
    return response;
};

export { getCachedData };