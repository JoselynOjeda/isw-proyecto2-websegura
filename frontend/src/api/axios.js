import axios from 'axios';

const api = axios.create({
    // Borramos el baseURL para que Vite haga la redirección invisible a través de Ngrok
    withCredentials: true // Permite el envío automático de cookies seguras (No borrar)
});

export default api;