var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var mainBowerFiles = require('gulp-main-bower-files');
var gulpFilter = require('gulp-filter');

var paths = {
    sass: ['./scss/**/*.scss'],
    appjs: ['./app/**/*.js']
};

gulp.task('serve:before', ['default', 'watch']);

gulp.task('default', ['sass', 'bower-js', 'bower-css', 'bower-fonts', 'app-js']);

gulp.task('sass', function (done) {
    gulp.src('./scss/**/*')
            .pipe(concat('style.min.css'))
            .pipe(sass())
            .on('error', sass.logError)
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./www/css/'))
            .on('end', done);
});

gulp.task('bower-js', function () {

    var filterJS = gulpFilter('**/*.js', {restore: false});

    return gulp.src('./bower.json')
            .pipe(mainBowerFiles())
            .pipe(filterJS)
            .pipe(concat('bower.min.js'))
            .pipe(ngAnnotate({single_quotes: true}))
            .pipe(uglify())
            .pipe(gulp.dest('./www/js'));
});

gulp.task('bower-css', function () {

    var filterCss = gulpFilter('**/*.css', {restore: false});


    return gulp.src('./bower.json')
            .pipe(mainBowerFiles())
            .pipe(filterCss)
            .pipe(concat('bower.min.css'))
            .pipe(minifyCss({
                keepSpecialComments: 0
            }))
            .pipe(gulp.dest('./www/css'));

});

gulp.task('bower-fonts', function () {

    var filterFonts = gulpFilter(['**/*.eot', '**/*.svg', '**/*.ttf', '**/*.woff'], {restore: true});

    return gulp.src('./bower.json')
            .pipe(mainBowerFiles())
            .pipe(filterFonts)
            .pipe(gulp.dest('./www/css/fonts'));
});


gulp.task('app-js', function (cb) {
    return gulp.src(['./app/**/*'])
            .pipe(concat('app.min.js'))
            .pipe(ngAnnotate({single_quotes: true}))
            .pipe(uglify())
            .pipe(gulp.dest('./www/js/'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.appjs, ['app-js']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
            .on('log', function (data) {
                gutil.log('bower', gutil.colors.cyan(data.id), data.message);
            });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
                '  ' + gutil.colors.red('Git is not installed.'),
                '\n  Git, the version control system, is required to download Ionic.',
                '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
                '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
                );
        process.exit(1);
    }
    done();
});
