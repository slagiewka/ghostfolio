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
    name: 'ui',
    coverage: {
      reporter: ['html'],
      reportsDirectory: '../../coverage/libs/ui'
    },
    environment: 'jsdom',
    globals: true,
    reporters: ['default'],
    setupFiles: ['src/test-setup.ts']
  }
});
