import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Handle fallback for SPA routes
    historyApiFallback: true,
    port: 3000
  },
  test: {
    environment: 'jsdom', // Simulate a browser environment
    globals: true, // Enable global functions like `describe` and `it`
    coverage: {
      reporter: ['text', 'json', 'html'], // Generate coverage reports in different formats
    },
  },
});

