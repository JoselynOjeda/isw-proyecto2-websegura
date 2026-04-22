import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
    proxy: {
      // Magia: Todo lo que vaya a /api, Vite se lo pasa al backend en secreto
      '/api': 'http://localhost:3000'
    }
  }
})