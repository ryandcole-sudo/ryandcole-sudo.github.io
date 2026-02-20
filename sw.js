const CACHE_NAME = 'my-app-cache-v1';

function normalizeURL(request) {
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return request;
  }

  // Remove query string
  url.search = '';

  // Normalize trailing slash (remove it unless root)
  if (url.pathname.endsWith('/') && url.pathname !== '/') {
    url.pathname = url.pathname.slice(0, -1);
  }

  return new Request(url.toString(), {
    method: request.method,
    headers: request.headers,
    mode: request.mode,
    credentials: request.credentials,
    redirect: request.redirect
  });
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/assets/flag.gif',
        '/favicon.ico'
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const normalizedRequest = normalizeURL(event.request);

  event.respondWith(
    caches.match(normalizedRequest).then(response => {
      return response || fetch(event.request);
    })
  );
});