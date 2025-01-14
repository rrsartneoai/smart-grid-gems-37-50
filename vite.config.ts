import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

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
      writeBundle() {
        // Copy PDF.js worker to public directory during build
        require('fs').copyFileSync(
          require.resolve('pdfjs-dist/build/pdf.worker.min.js'),
          'public/pdf.worker.min.js'
        );
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