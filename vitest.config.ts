import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json-summary'],
      include: [
        'src/domains/**/!(*.test|*.spec|*.pbt|setup).*.{ts,tsx}',
        'src/platform/**/!(*.test|*.spec|*.pbt|setup).*.{ts,tsx}',
        'src/metal/**/!(*.test|*.spec|*.pbt|setup).*.{ts,tsx}',
        'src/lib/**/!(*.test|*.spec|*.pbt|setup).*.{ts,tsx}',
      ],
      exclude: ['src/**/__tests__/**', 'src/**/*.data.ts', 'src/**/*.meta.ts', 'src/app/**'],
      thresholds: { lines: 60, functions: 60, branches: 50, statements: 60 },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
