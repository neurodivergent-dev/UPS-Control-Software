import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
      },
      manifest: {
        name: 'UPS Precision Control',
        short_name: 'UPS Control',
        description: 'Advanced UPS Monitoring and Management Dashboard',
        theme_color: '#BC00FF',
        background_color: '#030303',
        display: 'standalone',
        start_url: '.',
        scope: '.',
        icons: [
          {
            src: 'icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    cssMinify: false,
    minify: false,
    target: 'esnext'
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/ViewPower': {
        target: 'http://localhost:15178',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Origin', 'http://localhost:15178');
            proxyReq.setHeader('Referer', 'http://localhost:15178/ViewPower/monitor');
          });
          proxy.on('proxyRes', (proxyRes, _req, _res) => {
            // Cookie header'larını düzelt
            if (proxyRes.headers['set-cookie']) {
              proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map((cookie: string) => {
                return cookie.replace(/Domain=localhost;?/i, '').replace(/Path=\/ViewPower;?/i, 'Path=/;');
              });
            }
          });
        },
      },
    },
  },
})
