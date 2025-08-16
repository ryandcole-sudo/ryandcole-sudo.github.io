    self.addEventListener('install', event => {
      event.waitUntil(
        caches.open('my-app-cache-v1') // Define a cache name
          .then(cache => {
            return cache.addAll([
              '/app/money-counter',
              'assets/jamaica_money/1.png',
              'assets/jamaica_money/5.png',
              'assets/jamaica_money/10.png',
              'assets/jamaica_money/20.png',
              'assets/jamaica_money/50.png',
              'assets/jamaica_money/100.png',
              'assets/jamaica_money/500.png',
              'assets/jamaica_money/1000.png',
              'assets/jamaica_money/2000.png',
              'assets/jamaica_money/5000.png'
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
        caches.match(event.request, {ignoreSearch: true})
          .then(response => {
            return response || fetch(event.request); // Serve from cache or fetch from network
          })
      );
    });