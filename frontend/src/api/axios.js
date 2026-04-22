import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Confirma con Joselyn el puerto del backend
    withCredentials: true // Permite el envío automático de cookies seguras
});

export default api;