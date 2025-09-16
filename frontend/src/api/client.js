import axios from 'axios';

// Prefer Vite env var; fallback to localhost:8081
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

const api = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

export default api;

