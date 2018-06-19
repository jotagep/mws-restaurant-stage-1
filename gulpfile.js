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
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const responsive = require("gulp-responsive");
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const mergeStream = require('merge-stream');
const webp = require('gulp-webp');


// Reference to reload method
const reload = browserSync.reload;

const src_dev = {
  html: './src/*.html',
  css: './src/css/*.css',
  js: './src/js/*.js',
  img: './src/assets/img_original/'
}

const src_dist = {
  html: './dist/',
  css: './dist/css/',
  js: './dist/js/',
  img: './dist/assets/img/'
}

// Clean dist folder
gulp.task('clean-dist', function () {
  gulp.src('./dist', {
      read: false
    })
    .pipe(clean());
});

gulp.task('minify_sw', function () {
  return gulp.src('./src/sw.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(src_dist.html));
});

gulp.task('minify_vendor', function () {
  return gulp.src('./src/js/vendor/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js/vendor/'))
});

// minify and concat js files
gulp.task('minify_js', function () {
  return gulp.src(src_dev.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(src_dist.js))
});


// minify CSS
gulp.task('minify_css', function () {
  return gulp.src(src_dev.css)
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(src_dist.css))
})

//minify html
gulp.task('minify_html', function () {
  return gulp.src(src_dev.html)
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(src_dist.html));
});

// Task minify all together
gulp.task('minify', ['minify_js', 'minify_vendor', 'minify_sw', 'minify_css', 'minify_html']);

// Responsive images
gulp.task("resp-jpg", function () {
  return gulp
    .src(`${src_dev.img}*.{png,jpg}`)
    .pipe(
      responsive({
        "*.jpg": [{
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
        ]
      }, {
        // Global configuration for all images
        errorOnEnlargement: false,
        // The output quality for JPEG, WebP and TIFF output formats
        quality: 70,
        // Use progressive (interlace) scan for JPEG and PNG output
        progressive: true,
        // Strip all metadata
        withMetadata: false
      })
    )
    .pipe(gulp.dest("./src/assets/img/"))
    .pipe(gulp.dest(src_dist.img));
});

gulp.task('resp-img', ['resp-jpg'], function () {
  return gulp.src('./src/assets/img/*.jpg')
    .pipe(webp())
    .pipe(gulp.dest("./src/assets/img/"))
    .pipe(gulp.dest(src_dist.img));
});

// Build for production
gulp.task('build', ['resp-img', 'minify'], function () {
  // copy manifest, data and icons
  return mergeStream(
    gulp.src(['./src/assets/icon/*.png']).pipe(gulp.dest('./dist/assets/icon/')),
    gulp.src(['./src/manifest.json']).pipe(gulp.dest('./dist/'))
  );
})

// Serve dev version
gulp.task("serve", function () {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./src"
    }
  });
  gulp.watch(["./src/*.html", "./src/css/*.css", "./src/js/*.js"])
    .on("change", reload);
});

// Serve production version
gulp.task("serve:dist", ['build'], function () {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./dist"
    }
  })
});