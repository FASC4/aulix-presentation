// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/aulix-presentation/', // <-- Mismo nombre del repo en GitHub
})