let restaurants, neighborhoods, cuisines;
var map;
var markers = [];

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  fetchNeighborhoods();
  fetchCuisines();
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
  updateRestaurants();
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
    (error, restaurants) => {
      if (error) {
        // Got an error!
        console.error(error);
      } else {
        resetRestaurants(restaurants);
        fillRestaurantsHTML();
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
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = restaurant => {
  const li = document.createElement("li");
  li.className = "card";

  const picture = document.createElement("picture");
  li.append(picture);

  /* Sources WebP Images */
  const Webp_large = document.createElement("source");
  Webp_large.type = "image/webp";
  Webp_large.srcset = `./assets/img/${restaurant.id}-large.webp 1x`;
  Webp_large.media = `(min-width: 511px) and (max-width: 640px)`;
  picture.append(Webp_large);

  const WebP_medium = document.createElement("source");
  WebP_medium.type = "image/webp";
  WebP_medium.srcset = `./assets/img/${restaurant.id}-medium.webp 1x,
                        ./assets/img/${restaurant.id}-medium@2x.webp 2x`;
  WebP_medium.media = `(min-width: 411px) and (max-width: 510px),
                       (min-width: 791px) and (max-width: 930px),
                       (min-width: 1191px)`;
  picture.append(WebP_medium);

  const WebP_small = document.createElement("source");
  WebP_small.type = "image/webp";
  WebP_small.srcset = `./assets/img/${restaurant.id}-small.webp 1x,
                        ./assets/img/${restaurant.id}-small@2x.webp 2x`;
  WebP_small.media = ` (max-width: 410px),
                       (min-width: 650px) and (max-width: 800px),
                       (min-width: 950px) and (max-width: 1200px)`;
  picture.append(WebP_small);

  /* Sources JPEG Images */
  const Jpg_large = document.createElement("source");
  Jpg_large.type = "image/jpeg";
  Jpg_large.srcset = `./assets/img/${restaurant.id}-large.jpg 1x`;
  Jpg_large.media = `(min-width: 511px) and (max-width: 640px)`;
  picture.append(Jpg_large);

  const Jpg_medium = document.createElement("source");
  Jpg_medium.type = "image/jpeg";
  Jpg_medium.srcset = `./assets/img/${restaurant.id}-medium.jpg 1x,
                          ./assets/img/${restaurant.id}-medium@2x.jpg 2x`;
  Jpg_medium.media = `(min-width: 411px) and (max-width: 510px),
                         (min-width: 791px) and (max-width: 930px),
                         (min-width: 1191px)`;
  picture.append(Jpg_medium);

  const image_small = document.createElement("img");
  image_small.type = "image/webp";
  image_small.className = "card__img";
  image_small.srcset = `./assets/img/${restaurant.id}-small.jpg 1x,
                          ./assets/img/${restaurant.id}-small@2x.jpg 2x`;
  image_small.media = `(max-width: 410px),
                         (min-width: 650px) and (max-width: 800px),
                         (min-width: 950px) and (max-width: 1200px)`;
  image_small.alt = `${restaurant.name} - ${restaurant.photo_description}`;
  picture.append(image_small);

  const name = document.createElement("h1");
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
  more.innerHTML = "View Details";
  more.href = DBHelper.urlForRestaurant(restaurant);
  li.append(more);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, "click", () => {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};
