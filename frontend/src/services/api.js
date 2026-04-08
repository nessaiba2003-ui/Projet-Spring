import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api', // L'URL du backend Spring Boot
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
