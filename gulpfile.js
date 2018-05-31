/*
Commands

gulp resp-img -> Create responsive images
gulp minify -> Minify CSS,JS and HTML
gulp serve -> Serve dev version
gulp build -> Build a production version on dist folder
gulp serve:dist -> Serve a production version

*/

const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const responsive = require("gulp-responsive");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const webp = require('gulp-webp');


// Reference to reload method
const reload = browserSync.reload;


// minify js files
gulp.task('minify_sw', function() {
  return gulp.src('./sw.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'));
})

gulp.task('minify_js', ['minify_sw'], function() {
  return gulp.src('./js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js'))
})

// minify CSS
gulp.task('minify_css', function() {
  return gulp.src('./css/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
})

//minify html
gulp.task('minify_html', function() {
  return gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});

// Task minify all together
gulp.task('minify', ['minify_js', 'minify_css', 'minify_html']);

// Responsive images
gulp.task("resp-img", function() {
  return gulp
    .src("./assets/img_original/*.{png,jpg}")
    .pipe(
      responsive(
        {
          "*.jpg": [
            {
              // image-small.jpg is 300 pixels wide
              width: 300,
              rename: {
                suffix: "-small",
                extname: ".jpg"
              }
            },
            {
              // image-small@2x.jpg is 600 pixels wide
              width: 300 * 2,
              rename: {
                suffix: "-small@2x",
                extname: ".jpg"
              }
            },
            {
              // image-medium.jpg is 400 pixels wide
              width: 400,
              rename: {
                suffix: "-medium",
                extname: ".jpg"
              }
            },
            {
              // image-medium@2x.jpg is 800 pixels wide
              width: 400 * 2,
              rename: {
                suffix: "-medium@2x",
                extname: ".jpg"
              }
            },
            {
              // image-large.jpg is 600 pixels wide
              width: 600,
              rename: {
                suffix: "-large",
                extname: ".jpg"
              }
            },
            {
              // image-original.jpg is 800 pixels wide
              rename: {
                suffix: "-original",
                extname: ".jpg"
              }
            }
          ],

          "*.png": {
            width: "100%"
          }
        },
        {
          // Global configuration for all images
          errorOnEnlargement: false,
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          // Use progressive (interlace) scan for JPEG and PNG output
          progressive: true,
          // Strip all metadata
          withMetadata: false
        }
      )
    )
    .pipe(gulp.dest("./assets/img/"))
    .pipe(gulp.dest("./dist/assets/img/"));
});

gulp.task('webp', ['resp-img'], function() {
  return gulp.src('./assets/img/*.jpg')
    .pipe(webp())
    .pipe(gulp.dest("./assets/img/"))
    .pipe(gulp.dest("./dist/assets/img/"));
});

// Build for production
gulp.task('build', ['webp','minify'], function() {
  // copy manifest, data and icons
  gulp.src(['./assets/icon/*.png']).pipe(gulp.dest('./dist/assets/icon/'));
  gulp.src(['./data/**/*']).pipe(gulp.dest('./dist/data/'));
  gulp.src(['./manifest.json']).pipe(gulp.dest('./dist/'));
})

// Serve dev version
gulp.task("serve", function() {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./"
    }
  });

  gulp
    .watch(["./*.html", "./css/*.css", "./js/*.js"])
    .on("change", reload);
});

// Serve production version
gulp.task("serve:dist", ['build'], function() {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./dist"
    }
  });

  gulp
    .watch(["./dist/*", "./dist/css/*.css", "./dist/js/*.js"])
    .on("change", reload);
});