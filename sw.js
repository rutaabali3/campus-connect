// Minimal service worker for CampusConnect
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Pass-through fetch; reserved for future caching if needed
self.addEventListener('fetch', () => {});
