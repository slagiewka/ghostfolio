import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    name: 'common',
    coverage: {
      reporter: ['html'],
      reportsDirectory: '../../coverage/libs/common'
    },
    environment: 'jsdom',
    globals: true,
    reporters: ['default'],
    setupFiles: ['src/test-setup.ts']
  }
});
