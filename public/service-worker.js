const CACHE_NAME = "my-pwa-cache-v2";
const OFFLINE_URL = "/offline.html";

// Static assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/",
  OFFLINE_URL,
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// Install: Pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate Strategy
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const { request } = event;

  // For navigations, show offline fallback
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }

  // For assets: stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(request);
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => {
          // return cached asset if fetch fails
          return cachedResponse;
        });

      // Return cached if available, else wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
