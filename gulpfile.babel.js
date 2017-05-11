import gulp from 'gulp';
import autoprefixer from 'autoprefixer';
import reporter from 'postcss-reporter';
import loadPlugins from 'gulp-load-plugins';
import webpack from 'webpack-stream';
import sourcemaps from 'gulp-sourcemaps';
import rename from 'gulp-rename';
import uglify from 'gulp-uglify';
import util from 'gulp-util';


const $ = loadPlugins();

function errorAlert(error) {
  $.notify.onError({ title: 'SCSS Error', message: 'Check your terminal', sound: 'Sosumi', })(error);
  $.util.log(error.messageFormatted ? error.messageFormatted : error.message);
  this.emit('end');
}

/**
 * Build scripts with WebPack
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task( "scripts", function() {
   return gulp.src( "src/house-of-isometric.js" )
      .pipe( gulp.dest( "./dist" ) )
      .pipe( sourcemaps.init( { loadMaps: true } ) )
      .pipe(uglify().on('error', function(e){
        console.log(e);
      }))
      .pipe( rename( "house-of-isometric.min.js" ) )
      .pipe( sourcemaps.write( "./" ) )
      .pipe( gulp.dest( "dist/" ) );
} );

/**
 * Build styles from SCSS files
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task('stylesBuild', () => {
  return gulp.src([`src/house-of-isometric.scss`])
    .pipe($.plumber({ errorHandler: errorAlert }))
    .pipe($.util.noop())
    .pipe($.sass({
      outputStyle: 'compressed',
      precision: 5,
      includePaths: ['.'],
    }))
    .pipe($.postcss([
      autoprefixer({
        browsers: ["last 2 versions", "safari 5", "ie 8", "ie 9", "ff 27", "opera 12.1"],
        options: {
          map: true,
        }
      })
    ]))
    .pipe($.util.noop())
    .pipe($.cleanCss())
    .pipe($.concat('main.css'))
    .pipe($.size({ title: 'STYLES', showFiles: true }))
    .pipe(gulp.dest(`dist`));
});

gulp.task('stylesLint', () => {
  return gulp.src([`src/**/*.s+(a|c)ss`])
      .pipe($.plumber({ errorHandler: errorAlert }))
      .pipe($.postcss(
        [
          require('stylelint')(),
          reporter({
            clearMessages: true,
            throwError: true
          })
        ],
        {
          syntax: require('postcss-scss')
        }));
});

const styles = gulp.task('styles', ['stylesLint', 'stylesBuild']);
