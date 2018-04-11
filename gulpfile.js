const gulp = require('gulp');
const browserSync = require('browser-sync').create();

// Reference to reload method
const reload = browserSync.reload;

gulp.task('serve', function () {
    browserSync.init({
        port: 8000,
        server: {
            baseDir: "./"
        }
    });

    gulp.watch(['./*.html', './assets/css/*.css', './js/*.js']).on('change', reload);
});



