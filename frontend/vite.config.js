import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs' // Importamos esto para leer archivos del sistema

// Detectamos si estamos dentro de Docker buscando su archivo oculto
const isDocker = fs.existsSync('/.dockerenv');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 1. OBLIGATORIO PARA DOCKER
    host: true, 
    allowedHosts: true,
    
    proxy: {
      // 2. MAGIA: Decide automáticamente qué ruta usar
      '/api': isDocker ? 'http://backend:3000' : 'http://localhost:3000'
    }
  }
})