// ============================================================
// GitVora — Service Worker
// Enables offline support and PWA functionality
// ============================================================

const CACHE_NAME = "gitvora-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.html",
  "/css/landing.css",
  "/css/app.css",
  "/js/landing.js",
  "/js/app.js",
  "/img/logo.svg",
  "https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap",
];

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Silently continue even if some resources fail to cache
        return Promise.resolve();
      });
    }),
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        // Otherwise fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache if not a success response
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }
          // Clone and cache successful responses
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return response;
        });
      })
      .catch(() => {
        // Fallback for offline - could serve offline page here
        return new Response("Offline - cached version may not be available", {
          status: 503,
        });
      }),
  );
});
