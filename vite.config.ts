import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
    '/api': {
        target: 'http://localhost:15178',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Origin', 'http://localhost:15178');
            proxyReq.setHeader('Referer', 'http://localhost:15178/ViewPower/monitor');
          });
        },
      },
    },
  },
})
