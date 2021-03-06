let restaurants, neighborhoods, cuisines;
let showMap = false;
let showFavorite = false;
var map;
var markers = [];

const myLazyLoad = new LazyLoad();

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  fetchNeighborhoods();
  fetchCuisines();
  DBHelper.openDB();
  registerServiceWorker();
  updateRestaurants();
});

/**
 * Fetch all neighborhoods and set their HTML.
 */
fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById("neighborhoods-select");
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement("option");
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById("cuisines-select");

  cuisines.forEach(cuisine => {
    const option = document.createElement("option");
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
  addMarkersToMap();
};

/**
 * Update page and map for current restaurants.
 */
updateRestaurants = () => {
  const cSelect = document.getElementById("cuisines-select");
  const nSelect = document.getElementById("neighborhoods-select");

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    self.showFavorite,
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
        myLazyLoad.update();
      }
    }
  );
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
resetRestaurants = restaurants => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById("restaurants-list");
  ul.innerHTML = "";

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById("restaurants-list");
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  if (self.showMap) {
    addMarkersToMap();
  }
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement("li");
  li.className = "card";

  const card_heart = document.createElement('button');
  card_heart.setAttribute('role', 'button');
  card_heart.setAttribute('aria-label', `${restaurant.is_favorite === 'true' ? 'Remove' : 'Add'} to favorites`);
  card_heart.className = `card__heart ${restaurant.is_favorite === 'true' ? 'clicked': ''}`;
  li.append(card_heart);

  const heart = document.createElement("i");
  heart.className = `${restaurant.is_favorite === 'true' ? 'fas': 'far'} fa-heart`;
  card_heart.append(heart);

  // Clicked favourite
  card_heart.addEventListener('click', () => {
    restaurant.is_favorite = restaurant.is_favorite === 'true' ? 'false' : 'true';
    syncFavorite(restaurant);
    heart.classList.toggle('fas');
    heart.classList.toggle('far');
    card_heart.classList.toggle('clicked');
  });

  const picture = document.createElement("picture");
  li.append(picture);

  /* Sources WebP Images */
  const Webp_large = document.createElement("source");
  Webp_large.type = "image/webp";
  Webp_large.setAttribute('data-srcset', `${DBHelper.imageRespForRestaurant(restaurant, 'large', 'webp')}`);
  Webp_large.media = `(min-width: 511px) and (max-width: 640px)`;
  picture.append(Webp_large);

  const WebP_medium = document.createElement("source");
  WebP_medium.type = "image/webp";
  WebP_medium.setAttribute('data-srcset', `${DBHelper.imageRespForRestaurant(restaurant, 'medium', 'webp')}`);
  WebP_medium.media = `(min-width: 411px) and (max-width: 510px),
                       (min-width: 791px) and (max-width: 930px),
                       (min-width: 1191px)`;
  picture.append(WebP_medium);

  const WebP_small = document.createElement("source");
  WebP_small.type = "image/webp";
  WebP_small.setAttribute('data-srcset', `${DBHelper.imageRespForRestaurant(restaurant, 'small', 'webp')}`);
  WebP_small.media = `(max-width: 410px),
                       (min-width: 650px) and (max-width: 800px),
                       (min-width: 950px) and (max-width: 1200px)`;
  picture.append(WebP_small);

  /* Sources JPEG Images */
  const Jpg_large = document.createElement("source");
  Jpg_large.type = "image/jpeg";
  Jpg_large.setAttribute('data-srcset', `${DBHelper.imageRespForRestaurant(restaurant, 'large')}`);
  Jpg_large.media = `(min-width: 511px) and (max-width: 640px)`;
  picture.append(Jpg_large);

  const Jpg_medium = document.createElement("source");
  Jpg_medium.type = "image/jpeg";
  Jpg_medium.setAttribute('data-srcset', `${DBHelper.imageRespForRestaurant(restaurant, 'medium')}`);
  Jpg_medium.media = `(min-width: 411px) and (max-width: 510px),
                         (min-width: 791px) and (max-width: 930px),
                         (min-width: 1191px)`;
  picture.append(Jpg_medium);

  const image_small = document.createElement("img");
  image_small.type = "image/jpeg";
  image_small.className = "card__img";
  image_small.setAttribute('data-src', `${DBHelper.imageRespForRestaurant(restaurant, 'small')}`);
  image_small.media = `(max-width: 410px),
                         (min-width: 650px) and (max-width: 800px),
                         (min-width: 950px) and (max-width: 1200px)`;
  image_small.alt = `${restaurant.name}`;
  picture.append(image_small);

  const name = document.createElement("h3");
  name.className = "card__title";
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement("p");
  neighborhood.className = "card__description";
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement("p");
  address.className = "card__description";
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement("a");
  more.className = "card__button";
  more.setAttribute('role', 'button');
  more.setAttribute('aria-label', 'Go to restaurant details');
  more.innerHTML = "View Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
function addMarkersToMap(restaurants = self.restaurants) {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

/**
 * Toogle Map
 */

function toggleMap() {
  const map = document.getElementById("map");
  const btnMap = document.getElementById('btn-map');
  if (map.style.display === 'none') {
    self.showMap = true;
    btnMap.innerText = 'Hide Map';
    btnMap.setAttribute('aria-label', 'Hide Map');
    map.style.display = 'block';
    window.initMap();
  } else {
    self.showMap = false;
    btnMap.innerText = 'Show Map';
    btnMap.setAttribute('aria-label', 'Show Map');
    map.style.display = 'none';
  }
}

/**
 * Show / Hide Favorites
 */

function toggleFavorites() {
  const button = document.getElementById('favorites');
  self.showFavorite = !self.showFavorite;
  button.classList.toggle('clicked');
  button.setAttribute('aria-label', `${self.showFavorite ? 'Hide favorites' : 'Show favorites'}`);
  updateRestaurants();
}

/**
 * Register Service Worker
 */

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then(reg => {
          console.log('ServiceWorker registration successful with scope: ', reg.scope);
        })
        .catch(err => {
          // reg failed :(
          console.log("Service Worker failed: ", err);
        });
    });
  } else {
    console.log('== Service Worker not supported ==');
  }
}

/**
 *  Service Worker Sync Events
 */

// Favorite event
function syncFavorite(rest) {
  navigator.serviceWorker.ready.then(function (swRegistration) {
    const item = {
      id: rest.id,
      is_favorite: rest.is_favorite
    };
    DBHelper.openFavoriteDB().then(db => {
      var tx = db.transaction('favorites', 'readwrite');
      return tx.objectStore('favorites').put(item);
    }).then(() => {
      return swRegistration.sync.register('favorite').then(() => {
        console.log('* Favorite Sync *');
      });
    })
  });
}