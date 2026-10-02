const CACHE_NAME = "clearview-pwa-v6";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/puppies.html",
  "/apply.html",
  "/styles.css",
  "/script.js",
  "/manifest.webmanifest",
  "/install/",
  "/ck-icons/icon-192.webp",
  "/ck-icons/icon-512.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache =>
        Promise.allSettled(
          CORE_ASSETS.map(url =>
            cache.add(url)
          )
        )
      )
      .then(() =>
        self.skipWaiting()
      )
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(
              key =>
                key.startsWith("clearview-pwa-") &&
                key !== CACHE_NAME
            )
            .map(key =>
              caches.delete(key)
            )
        )
      )
      .then(() =>
        self.clients.claim()
      )
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (
    request.method !== "GET"
  ) {
    return;
  }

  const url =
    new URL(request.url);

  if (
    url.origin !==
      self.location.origin
  ) {
    return;
  }

  if (
    request.mode === "navigate"
  ) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache =>
              cache.put(
                request,
                copy
              )
            );

          return response;
        })
        .catch(async () => {
          return (
            (await caches.match(
              request
            )) ||
            (await caches.match(
              "/index.html"
            ))
          );
        })
    );

    return;
  }

  if (
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches
        .match(request)
        .then(cached => {
          const network =
            fetch(request)
              .then(response => {
                const copy =
                  response.clone();

                caches
                  .open(CACHE_NAME)
                  .then(cache =>
                    cache.put(
                      request,
                      copy
                    )
                  );

                return response;
              })
              .catch(() =>
                cached
              );

          return (
            cached ||
            network
          );
        })
    );

    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        const copy =
          response.clone();

        caches
          .open(CACHE_NAME)
          .then(cache =>
            cache.put(
              request,
              copy
            )
          );

        return response;
      })
      .catch(() =>
        caches.match(request)
      )
  );
});
