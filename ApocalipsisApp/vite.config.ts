import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Cambia el target si llamas a otras APIs
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Ruta local → objetivo externo
      '/api/sentry': {
        target: 'https://ssd-api.jpl.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace('/api/sentry', '/sentry.api'),
      },
      // Ejemplo extra: NEO feed, si lo usas
      '/api/neo': {
        target: 'https://api.nasa.gov',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace('/api/neo', '/neo/rest/v1/neo'),
      }
    }
  }
});
