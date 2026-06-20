import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use relative asset paths for production builds so the site works whether
  // it's served from a domain root or a GitHub Pages project subpath
  // (https://<user>.github.io/<repo>/). The dev server stays at '/'.
  base: command === 'build' ? './' : '/',
  plugins: [vue(), tailwindcss()],
}))
