
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    base: './', // Crucial for Capacitor relative paths
    define: {
      // Polyfill generic process.env to prevent "process is not defined" errors
      'process.env': {},
      // Safe injection of API Key
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      target: 'esnext' // Ensure top-level await and modern features work
    }
  };
});
