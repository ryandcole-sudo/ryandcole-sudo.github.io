    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open('my-app-cache-v1') // Define a cache name
          .then(cache => {
            return cache.addAll([
              '/',
              '/index.html',
              '/assets/flag.gif',
              'favicon.ico'
            ]);
          })
      );
    });

    self.addEventListener('activate', event => {
      event.waitUntil(
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.filter(cacheName => cacheName !== 'my-app-cache-v1')
              .map(cacheName => caches.delete(cacheName))
          );
        })
      );
    });

    self.addEventListener('fetch', event => {
      event.respondWith(
        caches.match(event.request)
          .then(response => {
            return response || fetch(event.request); // Serve from cache or fetch from network
          })
      );
    });