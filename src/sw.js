const staticCache = "rest-reviews-1.1.3";
const ImagesCache = "mws-images";
const allCaches = [
  staticCache,
  ImagesCache
]
const urlsToCache = [
  "/",
  "/index.html",
  "/restaurant.html",
  "/css/styles.css",
  "/js/restaurant_info.js",
  "/js/main.js",
  "/js/dbhelper.js",
  "/js/vendor/idb.js",
  "/manifest.json",
  "/assets/icon/favicon.png",
  "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css",
  "https://use.fontawesome.com/releases/v5.0.10/css/all.css",
  "https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/8.7.1/lazyload.min.js"
];

self.addEventListener('install', function (event) {
  // cache responses to requests for site assets
  console.log('== INSTALLING ==');
  event.waitUntil(
    caches.open(staticCache)
    .then(function (cache) {
      console.log('-- SW Installed --');
      return cache.addAll(urlsToCache)
        .then(() => {
          console.log(' -*- URLs added to Cache -*-');
        });
    })
    .catch(function (error) {
      console.log("Error adding all to cache, ", error);
    })
  );
});

self.addEventListener('fetch', (event) => {

  const requestURL = new URL(event.request.url);
  
  if (requestURL.origin === location.origin) {
    if (requestURL.pathname.startsWith('/assets/img')) {
      event.respondWith(serveImg(event.request));
      return;
    }
    if (requestURL.pathname === '/restaurant.html' ) {
      event.respondWith(
        caches.match('/restaurant.html')
        .then((response) => response || fetch(event.request))
        .catch(error => console.log('Match error, ', error))
      );
    }
  }
  event.respondWith(
    caches.match(event.request)
    .then((response) => response || fetch(event.request))
    .catch(error => console.log('Match error, ', error))
  );
});


function serveImg(request) {
  const storageUrl = request.url.replace(/-.*\.(jpg|webp)/, '');

  return caches.open(ImagesCache).then(function (cache) {
    return cache.match(storageUrl).then(function (response) {
      if (response) {
        console.log(`${storageUrl} 💻`);
        return response;
      };

      return fetch(request).then(function (networkResponse) {
        if (networkResponse.status == 200) {
          cache.put(storageUrl, networkResponse.clone());
        }
        console.log(`${storageUrl} 🌎`);
        return networkResponse;
      });
    });
  });
}

// Check newest cache and delete old version
self.addEventListener("activate", function (event) {
  console.log("New Service Worker activating");
  const cacheWhitelist = [staticCache];

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
        .filter(function (cacheName) {
          return (
            cacheName.startsWith("rest-reviews-") && cacheName != staticCache
          );
        })
        .map(function (cache) {
          if (cacheWhitelist.indexOf(cache) === -1) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});