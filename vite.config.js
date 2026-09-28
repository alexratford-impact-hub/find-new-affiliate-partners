import { defineConfig } from 'vite';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

export default defineConfig({
  root: '.',
  publicDir: false,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        workshop: resolve(__dirname, 'workshop.html'),
        notes: resolve(__dirname, 'notes.html'),
      },
    },
  },
  plugins: [
    copy({
      targets: [
        { src: 'skills/starter-kit/*', dest: 'dist/assets/starter-kit' }
      ],
      hook: 'writeBundle'
    })
  ]
});
