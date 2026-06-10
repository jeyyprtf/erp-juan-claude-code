import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 5173,
    proxy: {
      '/db/a': {
        target: 'https://qjgbbfocdsciiwezczjf.supabase.co/auth/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/db\/a/, '')
      },
      '/db/r': {
        target: 'https://qjgbbfocdsciiwezczjf.supabase.co/rest/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/db\/r/, '')
      }
    }
  },
});
