import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir:'./build', // Customize build output directory ./build ././ds_server/static
     emptyOutDir: true,
  },
})
