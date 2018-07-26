let restaurant;
var map;

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
    DBHelper.openDB();
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
            DBHelper.fetchReviewsById(restaurant.id).then(reviews => {
                reviews.sort((a, b) => {
                    return a.updatedAt >= b.updatedAt ? -1 : 1;
                });
                self.reviews = reviews;
                console.log('++ Reviews fetched! ++');
                fillRestaurantHTML();
            });
            callback(null, restaurant)
        });
    }
}


/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {

    const container = document.getElementById('restaurant-container');

    const restaurant_heart = document.createElement('button');
    restaurant_heart.setAttribute('role', 'button');
    restaurant_heart.setAttribute('aria-label', `${restaurant.is_favorite === 'true' ? 'Remove' : 'Add'} to favorites`);
    restaurant_heart.className = `heart ${restaurant.is_favorite === 'true' ? 'clicked': ''}`;
    container.append(restaurant_heart);

    const heart = document.createElement("i");
    heart.className = `${restaurant.is_favorite === 'true' ? 'fas': 'far'} fa-heart`;
    restaurant_heart.append(heart);

    // Clicked favourite
    restaurant_heart.addEventListener('click', () => {
        restaurant.is_favorite = restaurant.is_favorite === 'true' ? 'false' : 'true';
        syncFavorite(restaurant);
        heart.classList.toggle('fas');
        heart.classList.toggle('far');
        restaurant_heart.classList.toggle('clicked');
    });

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
    Jpg_medium.srcset = DBHelper.imageRespForRestaurant(restaurant, 'medium');
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
fillReviewsHTML = (reviews = self.reviews) => {
    console.log(self.reviews);
    const container = document.getElementById('reviews-container');

    const button_add = document.getElementById('button-add');
    button_add.setAttribute('aria-label', 'Show form to add review');
    button_add.addEventListener('click', showFormReview);


    if (!reviews || reviews.length < 1) {
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
    const date_updated = review.updatedAt ? new Date(review.updatedAt) : new Date(Date.now());
    date.innerHTML = `${date_updated.getUTCDate()}/${date_updated.getUTCMonth()+1}/${date_updated.getUTCFullYear()}`;
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

    if (review.id) {
        const button_del = document.createElement('button');
        button_del.className = 'review__button-del';
        button_del.setAttribute('role', 'button');
        button_del.setAttribute('aria-label', 'Delete Review');
        button_del.addEventListener('click', () => {
            self.reviews.splice(self.reviews.indexOf(review), 1);
            resetReview();
            syncDeleteReview(review);
        })
        button_del.innerHTML = "Delete";
        body.appendChild(button_del);      
    }

    li.appendChild(body);

    return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
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

/**
 * Favorite Handler
 */

function favoriteHandler(restaurant) {
    DBHelper.favoriteHandler(restaurant)
        .then(rest => {
            console.log(`The restaurant ${rest.name} => ${rest.is_favorite === "true" ? '❤️' : '💔' }`);
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * Reset Review
 */

function resetReview() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = '';
    fillReviewsHTML();
}

/**
 * Show Form Review
 */

function showFormReview() {
    const form = document.getElementById("form");
    const btnForm = document.getElementById('button-add');
    if (form.style.display === 'none') {
        self.showForm = true;
        btnForm.innerHTML = '<i class="fas fa-times"></i> Close Form';
        btnForm.setAttribute('aria-label', 'Close');
        form.style.display = 'block';
    } else {
        self.showForm = false;
        btnForm.innerHTML = '<i class="fas fa-plus"></i> Add review';
        btnForm.setAttribute('aria-label', 'Show form to add review');
        form.style.display = 'none';
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const review = {
            restaurant_id: self.restaurant.id,
            name: e.target.name.value,
            rating: e.target.rating.value,
            comments: e.target.comment.value
        }

        if (!review.name || !review.comments) return;
        form.reset();
        self.reviews.unshift(review);
        syncAddReview(review);
    });
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

// Add Review event
function syncAddReview(review) {

    navigator.serviceWorker.ready.then(function (swRegistration) {
        DBHelper.openAddReviewsDB().then(db => {
            var tx = db.transaction('reviews', 'readwrite');
            return tx.objectStore('reviews').put(review);
        }).then(() => {
            return swRegistration.sync.register('addReview').then(() => {
                console.log('# Add Review Sync #');
                resetReview();
                showFormReview();
            });
        })
    });
}

//Delete Review event
function syncDeleteReview(review) {
    navigator.serviceWorker.ready.then(function (swRegistration) {
        const item = {
            id: review.id,
            name: review.name
        };
        DBHelper.openDeleteReviewsDB().then(db => {
            var tx = db.transaction('reviews', 'readwrite');
            return tx.objectStore('reviews').put(item);
        }).then(() => {
            return swRegistration.sync.register('deleteReview').then(() => {
                console.log('>> Delete Review Sync <<');
            });
        })
    });
}