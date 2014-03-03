// Load plugins
var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

var srcPath = 'src/';
var distPath = 'dist/';
var all = '**/*';

var htmlName = 'html';
gulp.task(htmlName, function () {
	return gulp.src(srcPath + all + '.html')
		.pipe(gulp.dest(distPath));
});

var stylesName = 'styles';
var stylesPath = srcPath + 'style/';
var stylesMain = 'style.less';
gulp.task(stylesName, function () {
	return gulp.src(stylesPath + stylesMain)
		.pipe(less({ style: 'expanded' }))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minifycss())
		.pipe(gulp.dest(distPath));
});

var jsName = 'scripts';
var jsPath = srcPath + 'js/';
gulp.task(jsName, function () {
	return gulp.src(jsPath + all + '.js')
		.pipe(concat('script.js'))
		.pipe(uglify())
		.pipe(gulp.dest(distPath));
});

var resName = 'resources';
var resPath = 'res/';
gulp.task(resName, function () {
	return gulp.src(resPath + all)
		.pipe(gulp.dest(distPath + resPath));
});



gulp.task('default', function () {
	gulp.start(htmlName, stylesName, jsName, resName);
});

gulp.task('watch', function () {
	gulp.start('default');

	// Watch .html files
	gulp.watch(srcPath + all + '.html', [htmlName]);
	// Watch .less files
	gulp.watch(stylesPath + all + '.less', [stylesName]);
	// Watch .js files
	gulp.watch(jsPath + all + '.js', [jsName]);
	// Watch resources
	gulp.watch(resPath + all, [resName]);
});