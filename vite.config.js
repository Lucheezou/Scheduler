import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react/jsx-runtime.js': 'react/jsx-runtime'
    }
  }
})