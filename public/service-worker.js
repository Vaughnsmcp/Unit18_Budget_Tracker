
const FILES_TO_CACHE = [
  `/`,
  `/styles.css`,
  `/Manifest.webManifest`,
  `/db.js`,
  `/index.js`,
  `/index.html`,
  `./icon-192x192.png`


];

const CACHE_NAME = `static-cache-v2`;
const DATA_CACHE_NAME = `data-cache-v1`;

// install
self.addEventListener(`install`, event => {
  console.log(`begin install`);
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log(`Your files were pre-cached successfully!`);
      return cache.addAll(FILES_TO_CACHE);
    })
  );

  self.skipWaiting();
});
// activate
self.addEventListener(`activate`, event => {
  console.log(`begin activate`);
  event.waitUntil(
    caches.keys().then(keyList => Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log(`Removing old cache data`, key);
          return caches.delete(key);
        }
        return undefined;
      })
    ))
  );

  self.clients.claim();
});

// fetch
self.addEventListener(`fetch`, event => {
  console.log(`begin fetch`);
  // cache successful requests to the API
  if (event.request.url.includes(`/`)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then(cache => fetch(event.request)
        .then(response => {
          // If the response was good, clone it and store it in the cache.
          if (response.status === 200) {
            cache.put(event.request.url, response.clone());
          }

          return response;
        })
        .catch(err => {
          // Network request failed, try to get it from the cache.
          cache.match(event.request);
          console.error(err);
        }))
        .catch(err => console.error(err))
    );
  } else {
    // if the request is not for the API, serve static assets using "offline-first" approach.

    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
        .catch(err => console.error(err))
    );
  }
});