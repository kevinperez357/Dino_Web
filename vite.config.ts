import { defineConfig } from 'vite';

// Cambia 'Dino_Web' por el nombre exacto del repositorio en GitHub.
// Si lo publicas como <usuario>.github.io (repo raíz), pon base: '/'.
export default defineConfig({
  base: '/Dino_Web/',
  server: { port: 5173, open: true },
  build: { outDir: 'dist', sourcemap: true },
});
