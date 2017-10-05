import gulp from 'gulp';
import gls from 'gulp-live-server';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import notify from 'gulp-notify';
import concat from 'gulp-concat';
import minifycss from 'gulp-cssnano';
import sass from 'gulp-sass';
import scsslint from 'gulp-scss-lint';
import source from 'vinyl-source-stream';
import rename from 'gulp-rename';
import gutil from 'gulp-util';
import runSequence from 'run-sequence';
import uglify from 'gulp-uglify';
import nodemon from 'gulp-nodemon';

global.buildPath = './public/';
global.srcPath = './src/';
global.AUTOPREFIXER_BROWSERS = {
    browsers: ['ie >= 9', 'last 2 versions', '> 0%'],
    map: false
}

// -----------------------------------------
// STYLES
// -----------------------------------------
gulp.task('styles', () => {
    gutil.log(gutil.colors.magenta('==== Compile - Styles ===='));

    return gulp.src(`${global.srcPath}styles/main.scss`)
	.pipe(sass())
	.on('error', err => { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
	.pipe(postcss([ autoprefixer(global.AUTOPREFIXER_BROWSERS) ]))
	.on('error', err => { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
	.pipe(gulp.dest(`${global.buildPath}styles/`))
	.pipe(rename({ suffix: '.min' }))
	.pipe(minifycss({autoprefixer: false}))
	.on('error', err => { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
	.pipe(gulp.dest(`${global.buildPath}styles/`));

});

gulp.task('lint-styles', () => {
	gutil.log(gutil.colors.magenta('==== Lint - Styles ===='));

	return 	gulp.src(`${global.srcPath}styles/**/*.scss`)
				.pipe(scsslint({
					config: `${global.srcPath}styles/scss-lint.yml`,
					maxBuffer: 500 * 1024,
					reporterOutput: `${global.srcPath}styles/scss-output.xml`
				}));
});

// -----------------------------------------
// SCRIPTS
// -----------------------------------------
gulp.task('scripts', () => {
	gutil.log(gutil.colors.magenta('==== Compile - Scripts ===='));

	const b = browserify(`${global.srcPath}scripts/main.js`, {
		list: true
	});

	return b.bundle()
		.on('error', err => { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(source('main.js')) 					//Pass desired output filename to vinyl-source-stream
		.pipe(buffer())
		.pipe(gulp.dest(`${global.buildPath}scripts/`))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.on('error', err => { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
		.pipe(gulp.dest(`${global.buildPath}scripts/`));

});

gulp.task('dev-server', () => {

    /*nodemon({
        script: 'server.js',
        watch: ['./src/scripts', './src/styles'],
        ignore: ['node_modules/'],
        ext: 'js scss',
        env: { 'NODE_ENV': 'development' }
    })*/

    const server = gls('server.js', {env: {NODE_ENV: 'development'}});
    server.start();

    //watch the server, routes, and config file for changes
    gulp.watch(['server.js', './server/**/*.js'], () => {
      server.start.bind(server)()
    });

    //watch the scss files
    gulp.watch(`${global.srcPath}styles/**/*.scss`, ['styles'/*, 'lint-styles'*/]);
    gulp.watch(`${global.buildPath}styles/**/*.css`, file => {
        server.notify(...[file]);
    });

    //watch the js files
    gulp.watch(`${global.srcPath}scripts/**/*.js`, ['scripts']);
    gulp.watch(`${global.buildPath}scripts/**/*.js`, file => {
        console.log(file)
        server.notify(...[file]);
    });

});

gulp.task('build-dev', callback => {
	runSequence(
		'styles',
		//'lint-styles',
		'scripts',
		'dev-server',
		callback
	);
});

gulp.task('build-prod', callback => {
    runSequence(
		'styles',
		'scripts',
		callback
	);
});
