import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/beatrice/',
  build: {
    target: 'es2022',
    rollupOptions: { input: resolve(import.meta.dirname, 'index.source.html') },
  },
  test: { environment: 'node', setupFiles: ['./src/test-setup.js'] },
})
