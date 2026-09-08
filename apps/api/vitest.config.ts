import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Run tests in UTC for deterministic date-based calculations
process.env.TZ = 'UTC';

export default defineConfig({
  resolve: {
    tsconfigPaths: true
  },
  root: fileURLToPath(new URL('.', import.meta.url)),
  test: {
    name: 'api',
    coverage: {
      reporter: ['html'],
      reportsDirectory: '../../coverage/apps/api'
    },
    environment: 'node',
    globals: true,
    reporters: ['default']
  }
});
