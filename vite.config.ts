import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import { fileURLToPath } from 'url';

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
        const workerPath = fileURLToPath(new URL('./node_modules/pdfjs-dist/build/pdf.worker.min.js', import.meta.url));
        fs.copyFileSync(workerPath, 'public/pdf.worker.min.js');
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