/** Gulp build script */

var gulp        = require( 'gulp' );
var mocha       = require( 'gulp-mocha' );
var istanbul    = require( 'gulp-istanbul' );

// Task to run tests, with coverage
gulp.task( 'test', function ( cb ) {
    gulp.src( [ 'lib/**/*.js', 'index.js' ] )
        .pipe( istanbul( {
            includeUntested: true
        } ) )
        .pipe( istanbul.hookRequire() )
        .on( 'finish', function () {
            gulp.src( [ 'test/*.js' ] )
                .pipe( mocha() )
                .pipe( istanbul.writeReports( {
                    reporters: [ 'json' ]
                } ) )
                .on( 'end', cb );
            } );
} );

// Alias default task to 'test'
gulp.task( 'default', [ 'test' ] );
