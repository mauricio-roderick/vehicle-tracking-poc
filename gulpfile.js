'use strict';

var gulp       = require('gulp'),
	concat     = require('gulp-concat'),
	plumber    = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	mocha      = require('gulp-mocha'),
	notify     = require('gulp-notify'),
	nodemon    = require('gulp-nodemon'),
	jshint     = require('gulp-jshint'),
	jsonlint   = require('gulp-json-lint'),
	csslint    = require('gulp-csslint'),
	uglifyJS   = require('gulp-uglify'),
	minifyCSS  = require('gulp-cssnano'),
	sourcemaps = require('gulp-sourcemaps');

var paths = {
	js: ['*.js', '*/*.js', '*/**/*.js', '!node_modules/**', '!public/lib/**', '!public/bower/**', '!public/dist/**', '!public/otherlib/**', '!build/**'],
	json: ['*.json', '*/*.json', '*/**/*.json', '!node_modules/**', '!public/lib/**', '!public/bower/**', '!public/dist/**', '!build/**'],
	client: {
		html: ['public/modules/*.html', 'public/modules/**/*.html'],
		js: ['public/*.js', 'public/modules/*.js', 'public/modules/**/*.js'],
		css: ['public/modules/*.css', 'public/modules/**/*.css'],
		tests: []
	},
	server: {
		js: ['app.js', 'app/**/*.js', 'config/**/*.js'],
		html: ['app/views/**/*.html'],
		tests: []
	}
};

gulp.task('js-lint', function () {
	return gulp.src(paths.js)
		.pipe(plumber())
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('json-lint', function () {
	return gulp.src(paths.json)
		.pipe(plumber())
		.pipe(jsonlint({
			comments: true
		}))
		.pipe(jsonlint.report());
});

gulp.task('css-lint', function () {
	return gulp.src(paths.client.css)
		.pipe(plumber())
		.pipe(csslint())
		.pipe(csslint.reporter())
		.pipe(csslint.failReporter());
});

gulp.task('js-minify', function () {
	return gulp.src(paths.client.js)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(concat('application.min.js'))
		.pipe(uglifyJS({
			mangle: true
		}))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./public/dist'))
		.pipe(livereload());
});

gulp.task('css-minify', function () {
	return gulp.src(paths.client.css)
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(concat('application.min.css'))
		.pipe(minifyCSS())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./public/dist'))
		.pipe(livereload());
});

gulp.task('html', function () {
	return gulp.src(paths.client.html)
		.pipe(livereload())
		.pipe(notify({message: 'Views Refreshed'}));
});

gulp.task('css', function () {
	return gulp.src(paths.client.css)
		.pipe(livereload())
		.pipe(notify({message: 'Views Refreshed'}));
});

gulp.task('watch', function () {
	livereload.listen();
	gulp.watch(paths.client.html, ['html']);
	gulp.watch(paths.client.css, ['css-lint', 'css-minify']);
	gulp.watch(paths.client.js, ['js-lint', 'json-lint', 'js-minify']);
});

gulp.task('run', function () {
	nodemon({
		script: 'app.js',
		ext: 'js html',
		watch: paths.server.js,
		ignore: ['node_modules', 'public', 'public/lib', '.idea', '.git'],
		restartable: 'rs',
		env: {
			NODE_ENV: 'development'
		}
	});
});

gulp.task('run-tests', function () {
	return gulp.src(paths.server.tests)
		.pipe(mocha({reporter: 'spec'}))
		.pipe(notify({message: 'Specs ran'}));
});

gulp.task('lint', ['js-lint', 'json-lint', 'css-lint']);
gulp.task('minify', ['js-minify', 'css-minify']);
gulp.task('build', ['lint', 'minify']);
gulp.task('test', ['lint']);
gulp.task('default', ['run', 'watch']);