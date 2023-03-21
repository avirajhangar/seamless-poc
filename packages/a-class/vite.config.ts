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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/assets/scss/_custom.scss";
          @import "@/assets/scss/_fonts.scss";
          @import "@/assets/scss/_mixins.scss";
          @import "@/assets/scss/_vue-transitions.scss";
          @import "@/assets/scss/variables/_colours.scss";
          @import "@/assets/scss/variables/_breakpoints.scss";
          @import "@/assets/scss/variables/_layout.scss";
          @import "@/assets/scss/mixins/_effects.scss";
          @import "@/assets/scss/mixins/_responsive.scss";
          @import "@/assets/scss/mixins/_units.scss";
          @import "@/assets/scss/_custom";
          @import "@/assets/scss/_fonts";
          @import "@/assets/scss/_mixins";
          @import "@/assets/scss/_vue-transitions";
          @import "@/assets/scss/variables/_colours";
          @import "@/assets/scss/variables/_breakpoints";
          @import "@/assets/scss/variables/_layout";
          @import "@/assets/scss/mixins/_effects";
          @import "@/assets/scss/mixins/_responsive";
          @import "@/assets/scss/mixins/_units";
        `
      }
    }
  },
  build: {
    lib: {
      name: 'ukscc-a-class',
      entry: './src/index.wc.ts',
      fileName: () => `index.js`,
      formats: ['umd']
    },
    rollupOptions,
  },
});
