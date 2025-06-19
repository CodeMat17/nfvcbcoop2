const STATIC_CACHE = "static-cache-v1";
const DYNAMIC_CACHE = "dynamic-cache-v1";

const STATIC_ASSETS = [
  "/",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/offline.html",
];

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...");
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[SW] Precaching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // ✅ Handle full-page navigations with offline fallback
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  // ✅ Cache First for static files (CSS, JS, images)
  const url = new URL(request.url);
  const isStatic =
    STATIC_ASSETS.includes(url.pathname) ||
    /\.(?:js|css|woff2?|eot|ttf|otf|png|jpg|jpeg|svg|gif)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) =>
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, res.clone());
            return res;
          })
        );
      })
    );
    return;
  }

  // ✅ Stale While Revalidate for everything else (e.g. API)
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchAndCache = fetch(request).then((res) =>
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, res.clone());
          return res;
        })
      );
      return cached ? Promise.race([cached, fetchAndCache]) : fetchAndCache;
    })
  );
});
