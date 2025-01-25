import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['chitchat.png', 'chitchat.png'],
      manifest: {
        name: 'ChitChat',
        short_name: 'ChitChat',
        description: 'Online chart application.',
        theme_color: '#00FFFFFF',
        "icons": [
          {
            "src": "/icons/icon-144x144.png",
            "sizes": "144x144", 
            "type": "image/png"
          },
          {
            "src": "/icons/icon-192x192.png",
            "sizes": "192x192", 
            "type": "image/png"
          },
          {
            "src": "/icons/icon-512x512.png",
            "sizes": "512x512", 
            "type": "image/png",
          },

        ]
      },
    }),
  ],
});