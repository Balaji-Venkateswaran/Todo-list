import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/todos': 'http://localhost:5000',
      '/todos': 'https://todolist-backend-t4o7.onrender.com',
    },
  },
})
