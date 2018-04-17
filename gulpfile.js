const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const responsive = require("gulp-responsive");

// Reference to reload method
const reload = browserSync.reload;

gulp.task("serve", function() {
  browserSync.init({
    port: 8000,
    server: {
      baseDir: "./"
    }
  });

  gulp
    .watch(["./*.html", "./assets/css/*.css", "./js/*.js"])
    .on("change", reload);
});

gulp.task("resp-img", function() {
  return gulp
    .src("./assets/img/*.{png,jpg}")
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
            },
            {
              // image-small.webp is 300 pixels wide
              width: 300,
              rename: {
                suffix: "-small",
                extname: ".webp"
              }
            },
            {
              // image-small@2x.webp is 600 pixels wide
              width: 300 * 2,
              rename: {
                suffix: "-small@2x",
                extname: ".webp"
              }
            },
            {
              // image-medium.webp is 400 pixels wide
              width: 400,
              rename: {
                suffix: "-medium",
                extname: ".webp"
              }
            },
            {
              // image-medium@2x.webp is 800 pixels wide
              width: 400 * 2,
              rename: {
                suffix: "-medium@2x",
                extname: ".webp"
              }
            },
            {
              // image-large.webp is 600 pixels wide
              width: 600,
              rename: {
                suffix: "-large",
                extname: ".webp"
              }
            },
            {
              // image-original.webp is 800 pixels wide
              rename: {
                suffix: "-original",
                extname: ".webp"
              }
            }
          ],

          "*.png": {
            width: "100%"
          },
          "*": {
            width: "100%"
          }
        },
        {
          // Global configuration for all images
          // The output quality for JPEG, WebP and TIFF output formats
          quality: 70,
          // Use progressive (interlace) scan for JPEG and PNG output
          progressive: true,
          // Strip all metadata
          withMetadata: false
        }
      )
    )
    .pipe(gulp.dest("./assets/img/"));
});
