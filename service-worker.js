// ============================================================
// GitVora — Service Worker
// Enables offline support and PWA functionality
// ============================================================

const CACHE_NAME = "gitvora-v7";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.html",
  "/css/landing.css",
  "/css/app.css",
  "/js/landing.js",
  "/js/app.js",
  "/js/setup-wizard.js",
  "/js/skill-tree.js",
  "/js/features.js",
  "/js/ai-assistant.js",
  "/img/logo.svg",
  "https://unpkg.com/@phosphor-icons/web",
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

// Fetch event - Network-First with Cache Fallback
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-store" }) // Force network to bypass browser cache
      .then((response) => {
        // Clone and cache successful responses
        if (response && response.status === 200 && response.type !== "error") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network fails (offline)
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response("Offline - cached version may not be available", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
      }),
  );
});
