import { defineConfig } from 'vite'

export default defineConfig({
  base: '/beatrice/',
  build: { target: 'es2022' },
  test: { environment: 'node', setupFiles: ['./src/test-setup.js'] },
})
