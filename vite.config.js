import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Allow `@` as an alias for `src/`
    },
  },
  test: {
    environment: 'jsdom',    // So we have a DOM-like environment
    globals: true,           // Allows global methods like `describe, test, expect`
    setupFiles: './src/setupTests.js' // A place for imports like jest-dom
  }
})

