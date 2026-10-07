const CACHE_NAME = "instructor-prep-v6";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./js/data.en.js",
  "./js/i18n.js",
  "./js/icons.js",
  "./js/apnea.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  // Réseau en priorité, en forçant le contournement du cache HTTP du
  // navigateur (sinon "network-first" peut quand même renvoyer une
  // réponse mise en cache par le navigateur lui-même, pas seulement
  // par ce service worker). Repli sur le cache du service worker
  // uniquement si hors-ligne ou requête impossible.
  const freshRequest = new Request(event.request.url, {
    method: event.request.method,
    headers: event.request.headers,
    mode: event.request.mode === "navigate" ? "same-origin" : event.request.mode,
    credentials: event.request.credentials,
    redirect: event.request.redirect,
    cache: "no-store",
  });
  event.respondWith(
    fetch(freshRequest)
      .then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
