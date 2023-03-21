import { defineConfig } from 'vitest/config';
import { createVuePlugin } from 'vite-plugin-vue2';
import { resolve } from './vite.config';

export default defineConfig({
  plugins: [createVuePlugin()],
  resolve,
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)'],
    coverage: {
      reporter: ['text', 'json', 'html', 'json-summary'],
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
})

