const CACHE_NAME = "rest-reviews-1.0.1";
const urlsToCache = [
  "/",
  "/index.html",
  "/restaurant.html",
  "/data/restaurants.json",
  "/assets/css/styles.css",
  "/js/dbhelper.js",
  "/js/regSW.js",
  "/js/main.js",
  "/js/restaurant_info.js",
  "/manifest.json",
  "https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.0/normalize.min.css",
  "https://use.fontawesome.com/releases/v5.0.10/css/all.css",
  "https://fonts.googleapis.com/css?family=Open+Sans:300,400|Raleway:300,400",
  "/assets/img/1-small.jpg",
  "/assets/img/2-small.jpg",
  "/assets/img/3-small.jpg",
  "/assets/img/4-small.jpg",
  "/assets/img/5-small.jpg",
  "/assets/img/6-small.jpg",
  "/assets/img/7-small.jpg",
  "/assets/img/8-small.jpg",
  "/assets/img/9-small.jpg",
  "/assets/img/10-small.jpg",
  "/assets/img/1-small@2x.jpg",
  "/assets/img/2-small@2x.jpg",
  "/assets/img/3-small@2x.jpg",
  "/assets/img/4-small@2x.jpg",
  "/assets/img/5-small@2x.jpg",
  "/assets/img/6-small@2x.jpg",
  "/assets/img/7-small@2x.jpg",
  "/assets/img/8-small@2x.jpg",
  "/assets/img/9-small@2x.jpg",
  "/assets/img/10-small@2x.jpg",
  "/assets/img/1-small.webp",
  "/assets/img/2-small.webp",
  "/assets/img/3-small.webp",
  "/assets/img/4-small.webp",
  "/assets/img/5-small.webp",
  "/assets/img/6-small.webp",
  "/assets/img/7-small.webp",
  "/assets/img/8-small.webp",
  "/assets/img/9-small.webp",
  "/assets/img/10-small@2x.webp",
  "/assets/img/1-small@2x.webp",
  "/assets/img/2-small@2x.webp",
  "/assets/img/3-small@2x.webp",
  "/assets/img/4-small@2x.webp",
  "/assets/img/5-small@2x.webp",
  "/assets/img/6-small@2x.webp",
  "/assets/img/7-small@2x.webp",
  "/assets/img/8-small@2x.webp",
  "/assets/img/9-small@2x.webp",
  "/assets/img/10-small@2x.webp",
  "/assets/img/1-medium.jpg",
  "/assets/img/2-medium.jpg",
  "/assets/img/3-medium.jpg",
  "/assets/img/4-medium.jpg",
  "/assets/img/5-medium.jpg",
  "/assets/img/6-medium.jpg",
  "/assets/img/7-medium.jpg",
  "/assets/img/8-medium.jpg",
  "/assets/img/9-medium.jpg",
  "/assets/img/10-medium.jpg",
  "/assets/img/1-medium@2x.jpg",
  "/assets/img/2-medium@2x.jpg",
  "/assets/img/3-medium@2x.jpg",
  "/assets/img/4-medium@2x.jpg",
  "/assets/img/5-medium@2x.jpg",
  "/assets/img/6-medium@2x.jpg",
  "/assets/img/7-medium@2x.jpg",
  "/assets/img/8-medium@2x.jpg",
  "/assets/img/9-medium@2x.jpg",
  "/assets/img/10-medium@2x.jpg",
  "/assets/img/1-medium.webp",
  "/assets/img/2-medium.webp",
  "/assets/img/3-medium.webp",
  "/assets/img/4-medium.webp",
  "/assets/img/5-medium.webp",
  "/assets/img/6-medium.webp",
  "/assets/img/7-medium.webp",
  "/assets/img/8-medium.webp",
  "/assets/img/9-medium.webp",
  "/assets/img/10-medium.webp",
  "/assets/img/1-medium@2x.webp",
  "/assets/img/2-medium@2x.webp",
  "/assets/img/3-medium@2x.webp",
  "/assets/img/4-medium@2x.webp",
  "/assets/img/5-medium@2x.webp",
  "/assets/img/6-medium@2x.webp",
  "/assets/img/7-medium@2x.webp",
  "/assets/img/8-medium@2x.webp",
  "/assets/img/9-medium@2x.webp",
  "/assets/img/10-medium@2x.webp",
  "/assets/img/1-large.jpg",
  "/assets/img/2-large.jpg",
  "/assets/img/3-large.jpg",
  "/assets/img/4-large.jpg",
  "/assets/img/5-large.jpg",
  "/assets/img/6-large.jpg",
  "/assets/img/7-large.jpg",
  "/assets/img/8-large.jpg",
  "/assets/img/9-large.jpg",
  "/assets/img/10-large.jpg",
  "/assets/img/1-large.webp",
  "/assets/img/2-large.webp",
  "/assets/img/3-large.webp",
  "/assets/img/4-large.webp",
  "/assets/img/5-large.webp",
  "/assets/img/6-large.webp",
  "/assets/img/7-large.webp",
  "/assets/img/8-large.webp",
  "/assets/img/9-large.webp",
  "/assets/img/10-large.webp",
  "/assets/img/1-original.jpg",
  "/assets/img/2-original.jpg",
  "/assets/img/3-original.jpg",
  "/assets/img/4-original.jpg",
  "/assets/img/5-original.jpg",
  "/assets/img/6-original.jpg",
  "/assets/img/7-original.jpg",
  "/assets/img/8-original.jpg",
  "/assets/img/9-original.jpg",
  "/assets/img/10-original.jpg",
  "/assets/img/1-original.webp",
  "/assets/img/2-original.webp",
  "/assets/img/3-original.webp",
  "/assets/img/4-original.webp",
  "/assets/img/5-original.webp",
  "/assets/img/6-original.webp",
  "/assets/img/7-original.webp",
  "/assets/img/8-original.webp",
  "/assets/img/9-original.webp",
  "/assets/img/10-original.webp",
  "/assets/img/favicon.png"
];

self.addEventListener("install", function(event) {
  // cache responses to requests for site assets
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log("Error addingAll to cache, ", error);
      })
  );
});

self.addEventListener('fetch', (event) => {
   console.log('Fetch this events: ', event.request.url);
  
    event.respondWith(caches.match(event.request)
      .then( (response) => {
        if (response) {
          console.log('DE Cache');
          return response;
        };
        console.log('De RED');
        return fetch(event.request);
      })
      .catch(error => console.log('Match error, ', error)));
  });
  


// Check newest cache and delete old version
self.addEventListener("activate", function(event) {
  console.log("New Service Worker activating");
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith("rest-reviews-") && cacheName != CACHE_NAME
            );
          })
          .map(function(cache) {
            if (cacheWhitelist.indexOf(cache) === -1) {
              return caches.delete(cache);
            }
          })
      );
    })
  );
});

