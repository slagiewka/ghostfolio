import angular from '@analogjs/vite-plugin-angular';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [angular()],
  resolve: {
    tsconfigPaths: true
  },
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    name: 'client',
    coverage: {
      reporter: ['html'],
      reportsDirectory: '../../coverage/apps/client'
    },
    environment: 'jsdom',
    globals: true,
    passWithNoTests: true,
    reporters: ['default'],
    setupFiles: ['src/test-setup.ts']
  }
});
