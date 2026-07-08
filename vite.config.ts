import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Respect a PORT injected by the harness/preview so the dev server and its
  // proxy agree on a port; falls back to Vite's default 5173 locally.
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
})
