import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/spotify': {
        target: 'https://api.spotify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/spotify/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
      '/api/spotify-accounts': {
        target: 'https://accounts.spotify.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/spotify-accounts/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    },
  },
})
