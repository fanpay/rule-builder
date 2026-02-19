import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: fs.existsSync('./localhost-key.pem') && fs.existsSync('./localhost.pem') ? {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    } : undefined,
    port: 5175,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
