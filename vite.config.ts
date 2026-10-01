import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The app is served from https://<user>.github.io/business-manager/
// so all asset URLs must be prefixed with the repo name.
export default defineConfig({
  base: '/business-manager/',
  plugins: [react()],
})
