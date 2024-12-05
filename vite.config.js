import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
build: {
  rollupOptions: {
    output: {
      globals: {
        recharts: 'Recharts',
        xlsx: 'XLSX'
      },
      manualChunks: {
        pdfjsLib: ['pdfjs-dist']
      }
    }
  }
}
})
