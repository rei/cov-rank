'use strict';

var args = require( 'minimist' )( process.argv.slice( 2 ) );
var log  = require( './lib/logger' )();
var pkg  = require( './package.json' );

if( args.version ) {
    log.info( 'v' + pkg.version );
    return;
}

log.info( 'Done!' );
