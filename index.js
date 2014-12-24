'use strict';

var fs          = require( 'fs' );
var args        = require( 'minimist' )( process.argv.slice( 2 ) );
var log         = require( './lib/logger' )();
var genReport   = require( './lib/generate-report' );
var pkg         = require( './package.json' );

if( args.version ) {
    log.info( 'v' + pkg.version );
    return;
}

// Generate a report
var report = genReport( {
    repoPath:   args.repo                   || '.',
    testCmd:    args[ 'repo-test-command' ] || 'npm tst',
    covReport:  args[ 'repo-cov-report' ]   || './coverage/coverage-summary.json'
} );

// Write the report
var reportString = JSON.stringify( report, null, 2 );
fs.writeSync( reportString );

log.info( 'Done!' );
