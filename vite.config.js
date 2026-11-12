import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages (project site) dihoskan di https://<nama>.github.io/<repo>/
// Tukar VITE_BASE dalam .env jika nama repo anda berbeza. Mesti bermula & berakhir dengan "/".
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return { plugins: [react()], base: env.VITE_BASE || '/emotion-connect/' };
});
