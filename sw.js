// Service Worker - DISABLED
// This script unregisters the service worker and clears caches
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){
      return self.registration.unregister();
    })
  );
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  // Pass through everything - no caching
  e.respondWith(fetch(e.request));
});