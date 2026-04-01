import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Points to your backend on port 8081
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;