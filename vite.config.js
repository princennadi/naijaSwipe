import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',    // Makes the dev server accessible from other devices
    port: 5173,         // Or whatever port you want
  },
});
