const CACHE_NAME = 'tuh-stock-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/reagent_placeholder.png',
  '/assets/tuh_lab_logo_circle.png',
  '/assets/tuh_lab_logo.jpg'
];

self.addEventListener('install', (e) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
});

self.addEventListener('activate', (e) => {
  // Claim client pages immediately
  e.waitUntil(
    self.clients.claim().then(() => {
      return caches.keys().then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      });
    })
  );
});

self.addEventListener('fetch', (e) => {
  // Only handle GET requests and local scope fetches
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip API endpoints
  if (e.request.url.includes('/api/')) {
    return;
  }

  // Network-First Strategy
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is unavailable
        return caches.match(e.request);
      })
  );
});
