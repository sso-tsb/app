// Kill switch - unregisters all service workers and clears caches
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return caches.delete(k); }));
    }).then(function(){ return self.registration.unregister(); })
  );
  self.clients.claim();
});
self.addEventListener('fetch', function(e){
  e.respondWith(fetch(e.request).catch(function(){
    return new Response('offline', {status:503});
  }));
});