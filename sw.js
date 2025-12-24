
// Service Worker disabled for initial stability.
// Uncomment and configure correctly for PWA caching if needed.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());
