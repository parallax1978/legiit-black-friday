import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

/**
 * Review build of the three promotion pages for the shared cloud previews (claude.ai artifacts):
 * relative asset URLs, the offer-state override enabled on any host, and the Business and Agency
 * pages linking to each other's published URL.
 *
 *   VITE_PROMO_BUSINESS_PATH=<url> VITE_PROMO_AGENCY_PATH=<url> VITE_PROMO_BUCKS_PATH=<url> vite build --config vite.cloud.config.ts
 */
export default defineConfig({
  base: './',
  plugins: [react()],
  define: { 'import.meta.env.VITE_PROMO_PREVIEW': JSON.stringify('1') },
  build: {
    outDir: process.env.CLOUD_OUT ?? 'dist-cloud',
    emptyOutDir: true,
    assetsInlineLimit: (filePath) => (filePath.endsWith('.vtt') ? false : undefined),
    rollupOptions: { input: ['black-friday-business.html', 'black-friday-agency.html', 'legiit-bucks.html'] },
  },
})
