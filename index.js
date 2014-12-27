#! /usr/bin/env node

'use strict';

var util        = require( 'util' );
var fs          = require( 'fs' );
var args        = require( 'minimist' )( process.argv.slice( 2 ) );
var chalk       = require( 'chalk' );
var log         = require( './lib/logger' )();
var genReport   = require( './lib/generate-report' );
var pkg         = require( './package.json' );

// Print version and exit
if( args.version ) {
    util.puts( pkg.version );
    return;
}

log.info( 'Starting %s v%s', chalk.bold( pkg.name ), chalk.bold( pkg.version ) );

// Process arguments
var repoPath    = args.repo                     || '.';
var testCmd     = args[ 'repo-test-command' ]   || 'npm tst';
var reportPath  = args[ 'repo-cov-report' ]     || './coverage/coverage-summary.json';

log.info( 'Configuration:' );
log.info( '    Repository:   %s', chalk.magenta( repoPath ) );
log.info( '    Test command: %s', chalk.cyan( testCmd ) );
log.info( '    Report path:  %s', chalk.magenta( reportPath ) );

// Generate a report
var report = genReport( {
    repoPath:   repoPath,
    testCmd:    testCmd
} );

// Write the report to disk
var reportJSON = JSON.stringify( report, null, 2 );
fs.writeFileSync( reportPath, reportJSON );
log.info( 'Coverage rank report written to %s.', chalk.magenta( reportPath ) );

// Finish
log.info( 'Done!' );
