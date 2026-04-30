import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. OBLIGATORIO PARA DOCKER: Permite que la página salga del contenedor
    host: true, 
    
    allowedHosts: true,
    proxy: {
      // 2. CAMBIO CLAVE: Cambiamos "localhost" por "backend"
      '/api': 'http://localhost:3000'
    }
  }
})