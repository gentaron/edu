// EDU Service Worker — Offline Support
// Strategy: Stale-While-Revalidate for content, Cache-First for static assets

const CACHE_NAME = 'edu-v1';
const STATIC_CACHE = 'edu-static-v1';
const DATA_CACHE = 'edu-data-v1';

// Static assets to pre-cache
const STATIC_ASSETS = [
  '/',
  '/wiki',
  '/story',
  '/characters',
  '/card-game',
  '/universe',
  '/civilizations',
  '/timeline',
  '/factions',
  '/technology',
  '/ranking',
  '/auralis',
  '/mina',
  '/iris',
  '/liminal',
];

// Binary data files
const DATA_ASSETS = [
  '/data/wiki.edu',
  '/data/cards.edu',
  '/data/enemies.edu',
  '/data/civilizations.edu',
];

// Install: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE && key !== DATA_CACHE)
            .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Binary data: Cache-First
  if (url.pathname.startsWith('/data/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // Static assets (same origin): Stale-While-Revalidate
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((response) => {
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // External resources (GitHub raw for stories): Network-First with cache fallback
  if (url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(
      fetch(event.request).then((response) => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(DATA_CACHE).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      }).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }
});
