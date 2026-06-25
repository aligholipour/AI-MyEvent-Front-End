import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(env.GOOGLE_MAPS_PLATFORM_KEY || env.VITE_GOOGLE_MAPS_PLATFORM_KEY || ''),
      // 'process.env.API_BaseURL': JSON.stringify("https://myeventapi.aligholipour.ir/api"),
      'process.env.API_BaseURL': JSON.stringify("http://localhost:5066/api"),
      // 'process.env.File_BaseURL': JSON.stringify("https://myeventapi.aligholipour.ir")
      'process.env.File_BaseURL': JSON.stringify("http://localhost:5066")
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
