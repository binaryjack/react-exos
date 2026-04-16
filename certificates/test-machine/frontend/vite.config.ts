import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer]
    }
  },
  server: {
    port: 5174,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        ws: true
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@features': resolve(__dirname, './src/features'),
      '@shared': resolve(__dirname, './src/shared'),
      '@store': resolve(__dirname, './src/store'),
      // Peer dep mocks — same ones used by @formular/atomos internals
      '@atomos/ui': resolve(__dirname, '../../libs/formular-atomos/src/mocks/atomos-ui.tsx'),
      'formular.dev': resolve(__dirname, '../../libs/formular-atomos/src/mocks/formular-dev.ts')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux', 'redux-saga'],
          editor: ['@monaco-editor/react', 'monaco-editor'],
          dnd: ['react-dnd', 'react-dnd-html5-backend'],
          charts: ['recharts']
        }
      }
    }
  }
});