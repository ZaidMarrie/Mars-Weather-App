const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const browsersync = require('browser-sync').create();

// Compile SCSS
function scssTask() {
    return src('./src/scss/style.scss', { sourcemaps: true })
        .pipe(sass())
        .pipe(autoprefixer( { cascade: false } ))
        .pipe(dest('./build/css', { sourcemaps: '.' }));
}

// Copy JS
function copyJs() {
    return src('./src/js/script.js')
        .pipe(dest('build/js'));
}

// BrowserSync Tasks
function browserSyncServe(cb) {
    browsersync.init({
        server: {
            baseDir: '.',
        },
        notify: {
            styles: {
                top: 'auto',
                bottom: '0',
            },
        },
    });
    cb();
}
function browserSyncReload(cb) {
    browsersync.reload();
    cb();
}

// Watch task
function watchTask() {
    watch('*.html', browserSyncReload);
    watch('./src/js/*.js', series(copyJs, browserSyncReload));
    watch('./src/scss/**/*.scss', series(scssTask, browserSyncReload));
}

// Default Gulp Task
exports.default = series(scssTask, copyJs, browserSyncServe, watchTask);