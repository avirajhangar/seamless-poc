import { defineConfig } from 'vite';
import { plugins, resolve } from './vite.config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  resolve,
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/base.scss";`
      }
    }
  }
});
