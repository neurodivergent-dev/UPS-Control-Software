import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
    '/api': {
        target: 'http://localhost:15178',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        rewrite: (path) => path.replace(/^\/api/, ''),
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
