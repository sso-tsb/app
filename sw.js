var CACHE = 'sso-v1';
var PAGES = [
  '/app/observador_sso.html',
  '/app/lider_sso.html',
  '/app/index.html',
  '/app/proxy.html'
];

// Install: cache the app pages
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(PAGES);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: ONLY serve from cache for same-origin HTML pages
// NEVER intercept external requests (proxy.html navigations to Google)
self.addEventListener('fetch', function(e) {
  var url = e.request.url;
  
  // Let ALL external requests pass through without interception
  if (url.indexOf('sso-tsb.github.io') < 0) {
    return; // Don't call e.respondWith() - browser handles it normally
  }
  
  // For same-origin pages: cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // Update cache with new version
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, response.clone());
        });
        return response;
      }).catch(function() {
        // Offline and not cached
        return new Response('Pagina no disponible offline', {status: 503});
      });
    })
  );
});
