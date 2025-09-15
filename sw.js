const CACHE_NAME = 'siak-calendar-v1';
const URLS_TO_CACHE = [
  './',
  './calendario widget V3.html',
  './ICONA CALENDARIO SIAK.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS_TO_CACHE))
      .catch(err => console.warn('SW install cache error', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Strategie: cache-first, fallback a rete
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // opzionale: non mettere in cache risorse cross-origin non sicure
        return response;
      }).catch(() => {
        // fallback: se richiesta è per documento, ritorna la pagina cached
        if (event.request.mode === 'navigate' || (event.request.headers && event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
          return caches.match('./calendario widget V3.html');
        }
      });
    })
  );
});
