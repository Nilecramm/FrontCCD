import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
/*
export default defineConfig({
  plugins: [react()],
  // On supprime le bloc proxy car on utilise l'URL directe dans api.js
  server: {
    proxy: {}
  },
})*/


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // On intercepte les appels API pour les rediriger vers le backend
      '/subscriber': {
        target: 'http://127.0.0.1:10000/',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'http://127.0.0.1:10000/',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})