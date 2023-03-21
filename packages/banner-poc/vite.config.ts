import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import eslint from 'vite-plugin-eslint';
import seamlessCssInJS from '@seamless/vite-plugin-vue-wc-css';
import path from 'path';

export const rollupOptions = {
  external: ['vue', '@seamless/store', '@seamless/logger'],
  output: {
    globals: {
      vue: 'Vue',
      '@seamless/store': 'window.top.seamlessStore',
      '@seamless/logger': 'window.top.seamlessLogger',
    },
  },
};

export const resolve = {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
};

export const plugins = [createVuePlugin(), eslint(), seamlessCssInJS()];

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  resolve,
  build: {
    lib: {
      name: 'ukscc-banner-poc',
      entry: './src/index.wc.ts',
      fileName: () => `index.js`,
      formats: ['umd']
    },
    rollupOptions,
  }
});
