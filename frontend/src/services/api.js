// src/services/api.js
import axios from 'axios';


const api = axios.create({
    baseURL: 'http://localhost:9003/api',
    headers: {
        'Content-Type': 'application/json',
    }
});


api.interceptors.request.use(
    (config) => {
        const userString = localStorage.getItem('user');
        
        if (userString) {
            try {
                const user = JSON.parse(userString);
                if (user && user.token) {
                    config.headers['Authorization'] = `Bearer ${user.token}`;
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;