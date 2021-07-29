const { src, dest, watch, series } = require('gulp')
const sass  = require('gulp-sass')(require('node-sass'))
const postcss  = require('gulp-postcss')
const terser  = require('gulp-terser')
const cssnano  = require('cssnano')
const browsersync  = require('browser-sync').create()

// sass task
const scssTask = () => {
    return src('app/scss/styles.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', {sourcemaps: '.'}))
}

//js task
const jsTask = () => {
    return src('app/js/scripts.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', {sourcemaps: '.'}))
}

// browsersync tasks
const browsersyncServe = (cb) => {
    browsersync.init({
        server: {
            baseDir: '.'
        }
    })
    cb()
}

const browsersyncReload = (cb) => {
    browsersync.reload()
    cb()
}

// watch task
const watchTask = () => {
    watch('*.html', browsersyncReload)
    watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload))
}

// default gulp task
exports.default = series(
    scssTask,
    jsTask,
    browsersyncServe,
    watchTask
)