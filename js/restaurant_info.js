let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const picture = document.getElementById('restaurant-photo');

  /* Sources WebP Images */
  const Webp_original = document.createElement("source");
  Webp_original.type = "image/webp";
  Webp_original.srcset = DBHelper.imageRespForRestaurant(restaurant, 'original', 'webp');
  Webp_original.media = `(min-width: 661px) and (max-width: 860px),
                          (min-width: 1501)`;
  picture.append(Webp_original);

  const Webp_large = document.createElement("source");
  Webp_large.type = "image/webp";
  Webp_large.srcset = DBHelper.imageRespForRestaurant(restaurant, 'large', 'webp');
  Webp_large.media = `(min-width: 461px) and (max-width: 660px), 
                      (min-width: 1061px) and (max-width: 1500px)`;
  picture.append(Webp_large);

  const WebP_medium = document.createElement("source");
  WebP_medium.type = "image/webp";
  WebP_medium.srcset = DBHelper.imageRespForRestaurant(restaurant, 'medium', 'webp');
  WebP_medium.media = `(min-width: 361px) and (max-width: 460px),
                        (min-width: 861px) and (max-width: 1060px)`;
  picture.append(WebP_medium);

  const WebP_small = document.createElement("source");
  WebP_small.type = "image/webp";
  WebP_small.srcset = DBHelper.imageRespForRestaurant(restaurant, 'small', 'webp');
  WebP_small.media = `(max-width: 360px)`;
  picture.append(WebP_small);

  /* Sources JPEG Images */
  const Jpg_original = document.createElement("source");
  Jpg_original.type = "image/jpeg";
  Jpg_original.srcset = DBHelper.imageRespForRestaurant(restaurant, 'original');
  Jpg_original.media = `(min-width: 661px) and (max-width: 860px),
                        (min-width: 1501)`;
  picture.append(Jpg_original);

  const Jpg_large = document.createElement("source");
  Jpg_large.type = "image/jpeg";
  Jpg_large.srcset = DBHelper.imageRespForRestaurant(restaurant, 'large');
  Jpg_large.media = `(min-width: 461px) and (max-width: 660px), 
                      (min-width: 1061px) and (max-width: 1500px)`;
  picture.append(Jpg_large);

  const Jpg_medium = document.createElement("source");
  Jpg_medium.type = "image/jpeg";
  Jpg_medium.srcset =  DBHelper.imageRespForRestaurant(restaurant, 'medium');
  Jpg_medium.media = `(min-width: 361px) and (max-width: 460px),
                      (min-width: 861px) and (max-width: 1060px)`;
  picture.append(Jpg_medium);

  const image_small = document.createElement("img");
  image_small.type = "image/jpeg";
  image_small.srcset = DBHelper.imageRespForRestaurant(restaurant, 'small');
  image_small.media = `(max-width: 360px)`;
  image_small.alt = `${restaurant.name} - ${restaurant.photo_description}`;
  picture.append(image_small);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    day.className = 'day';
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    time.className = 'time';
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  li.className = 'review__card';
  const header = document.createElement('div');
  header.className = 'review__header';

  const name = document.createElement('h4');
  name.innerHTML = review.name;
  name.className = 'review__name';
  header.appendChild(name);

  const date = document.createElement('span');
  date.innerHTML = review.date;
  date.className = 'review__date';
  header.appendChild(date);

  li.appendChild(header);

  const body = document.createElement('div');
  body.className = 'review__body';

  const rating = document.createElement('span');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'review__rating';
  const icon = document.createElement('i');
  icon.className = 'fas fa-star';
  rating.appendChild(icon);
  body.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  comments.className = 'review__comments';
  body.appendChild(comments);

  li.appendChild(body);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
