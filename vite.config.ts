import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: '키즈스키 — 가족 스키 가이드',
        short_name: '키즈스키',
        description: '가족 단위 스키어를 위한 어린이 스키 가이드: 스키 지수, 장비, 안전, 배움터',
        lang: 'ko',
        theme_color: '#2b6cea',
        background_color: '#f2f6ff',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // 날씨 API는 항상 네트워크 우선, 실패 시에만 캐시 사용
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'weather-api',
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 3 },
            },
          },
          {
            urlPattern: /^https:\/\/img\.youtube\.com\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'yt-thumbs',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
});
