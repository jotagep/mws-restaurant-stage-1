importScripts('./js/vendor/idb.js');

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
    if (requestURL.pathname === '/restaurant.html') {
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

// Check sync events

self.addEventListener('sync', function (event) {
  if (event.tag === 'favorite') {
    event.waitUntil(
      sendFavorites()
    )
  } else if (event.tag === 'addReview') {
    event.waitUntil(
      sendReviews()
    )
  } else if (event.tag === 'deleteReview') {
    event.waitUntil(
      deleteReviews()
    )    
  }
});


// Send Favorites
function sendFavorites() {

  return idb.open('favorite_items', 1)
    .then(async db => {
      let tx = db.transaction('favorites', 'readonly');
      let store = tx.objectStore('favorites');
      const items = await store.getAll();

      items.forEach(restaurant => {
        favoriteHandler(restaurant)
          .then(rest => {
            console.log(`The restaurant ${rest.name} => ${rest.is_favorite === "true" ? '❤️' : '💔' }`);
            tx = db.transaction('favorites', 'readwrite');
            store = tx.objectStore('favorites');
            store.delete(rest.id);
          })
          .catch(err => {
            console.log(err);
          });
      });
    })
}

// DB Favorite handler
function favoriteHandler(item) {
  return fetch(`http://localhost:1337/restaurants/${item.id}/?is_favorite=${item.is_favorite}`, {
      method: 'PUT'
    })
    .then(res => res.json());
}

// Send Reviews

function sendReviews() {
  return idb.open('add_reviews', 1)
    .then(async db => {
      let tx = db.transaction('reviews', 'readonly');
      let store = tx.objectStore('reviews');
      const items = await store.getAll();

      items.forEach(review => {
        const id = review.id;
        delete review.id;
        addReviewHandler(review)
          .then(rev => {
            console.log(`Review ${rev.id} by ${rev.name} has been added 👍`);
            tx = db.transaction('reviews', 'readwrite');
            store = tx.objectStore('reviews');
            store.delete(id);
          })
          .catch(err => {
            console.log(err);
          });
      });
    })  
}

// DB Add handler
function addReviewHandler(review) {
  
  return fetch(`http://localhost:1337/reviews/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(review)
    })
    .then(res => res.json());
}

// Delete Reviews

function deleteReviews() {
  return idb.open('delete_reviews', 1)
    .then(async db => {
      let tx = db.transaction('reviews', 'readonly');
      let store = tx.objectStore('reviews');
      const items = await store.getAll();

      items.forEach(review => {
        deleteReviewHandler(review.id)
          .then(rev => {
            console.log(`Review ${rev.id} by ${rev.name} has been deleted 🗑️`);
            tx = db.transaction('reviews', 'readwrite');
            store = tx.objectStore('reviews');
            store.delete(rev.id);
          })
          .catch(err => {
            console.error(err);
          });
      });
    })  
}

// DB Delete Review handler
function deleteReviewHandler(id) {
  return fetch(`http://localhost:1337/reviews/${id}`, {
      method: 'DELETE'
    })
    .then(res => res.json());
}