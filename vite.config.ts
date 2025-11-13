// vite.config.js - CONFIGURAÇÃO MAIS FORTE
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2020',
    minify: false, // ← Desative minificação temporariamente
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
      supported: {
        'bigint': true // ← Habilite BigInt explicitamente
      }
    }
  }
});