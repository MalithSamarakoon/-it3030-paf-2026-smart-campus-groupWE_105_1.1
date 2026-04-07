import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Points to your backend on port 8081
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user && user.token) {
                config.headers.Authorization = `Bearer ${user.token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;