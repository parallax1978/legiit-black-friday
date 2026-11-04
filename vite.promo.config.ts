import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

declare const process: { env: Record<string, string | undefined> }

/**
 * Upload-ready build of the three promotion pages alone (see PROMO.md).
 *
 *   npm run build:promo                     -> dist-promo/black-friday/business/index.html,
 *                                              dist-promo/black-friday/agency/index.html,
 *                                              dist-promo/legiit-bucks/index.html, assets under /promo-assets/
 *   PROMO_BASE=/other/ npm run build:promo  -> the same under another base path
 *
 * Asset URLs are absolute under PROMO_BASE, so each page works at its folder URL with or without
 * the trailing slash. The pages link to each other at the deployed paths.
 */
const base = process.env.PROMO_BASE ?? '/'
const PAGES: Record<string, string> = {
  'black-friday-business.html': 'black-friday/business/index.html',
  'black-friday-agency.html': 'black-friday/agency/index.html',
  'legiit-bucks.html': 'legiit-bucks/index.html',
}

const pagesAsFolders: Plugin = {
  name: 'promo-pages-as-folders',
  enforce: 'post',
  generateBundle(_options, bundle) {
    for (const [from, to] of Object.entries(PAGES)) {
      const page = bundle[from]
      if (!page) continue
      page.fileName = to
      bundle[to] = page
      delete bundle[from]
    }
  },
}

const path = (folder: string) => `${base}${folder}/`

export default defineConfig({
  base,
  // promo-public/ holds the Cloudflare Pages _redirects and _headers files (and the favicon from public/ is copied too).
  publicDir: 'promo-public',
  plugins: [react(), pagesAsFolders],
  define: {
    'import.meta.env.VITE_PROMO_BUSINESS_PATH': JSON.stringify(path('black-friday/business')),
    'import.meta.env.VITE_PROMO_AGENCY_PATH': JSON.stringify(path('black-friday/agency')),
    'import.meta.env.VITE_PROMO_BUCKS_PATH': JSON.stringify(path('legiit-bucks')),
  },
  build: {
    outDir: process.env.PROMO_OUT ?? 'dist-promo',
    emptyOutDir: true,
    assetsDir: 'promo-assets',
    assetsInlineLimit: (filePath) => (filePath.endsWith('.vtt') ? false : undefined),
    rollupOptions: { input: Object.keys(PAGES) },
  },
})
