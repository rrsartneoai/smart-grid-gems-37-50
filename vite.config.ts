
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'pdf-worker-plugin',
      buildStart() {
        // Ensure public directory exists
        if (!fs.existsSync('public')) {
          fs.mkdirSync('public');
        }
        
        // Copy PDF.js worker to public directory during build
        const workerPath = path.resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.mjs');
        if (fs.existsSync(workerPath)) {
          fs.copyFileSync(workerPath, 'public/pdf.worker.mjs');
        } else {
          console.warn('PDF worker file not found at:', workerPath);
        }
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    rollupOptions: {
      external: []
    },
    target: 'es2020',
  },
  optimizeDeps: {
    include: ['react-dropzone', 'pdfjs-dist']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
}));
