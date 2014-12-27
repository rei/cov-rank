#! /usr/bin/env node

'use strict';

var util        = require( 'util' );
var path        = require( 'path' );
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

log.info( 'Starting %s %s', chalk.bold( pkg.name ), chalk.bold( pkg.version ) );

// Process arguments
var repoPath        = args.repo                     || '.' + path.sep;
var testCmd         = args[ 'repo-test-command' ]   || 'npm tst';
var covSummaryPath  = args[ 'repo-cov-summary' ]    || path.join( '.', 'coverage', 'coverage-summary.json' );
var reportPath      = args.report                   || path.join( '.', 'coverage', 'coverage-rank.json' );

log.info( '----' );
log.info( 'Configuration:' );
log.info( '    Target repo:             %s', chalk.magenta( repoPath ) );
log.info( '    Test command:            %s', chalk.cyan( testCmd ) );
log.info( '    Coverage summary path:   %s', chalk.magenta( covSummaryPath ) );
log.info( '    Rank report path:        %s', chalk.magenta( reportPath ) );
log.info( '----' );

// Generate a report
log.info( 'Generating coverage rank report for %s', chalk.magenta( repoPath ) );

var report = genReport( {
    repoPath:   repoPath,
    testCmd:    testCmd,
    covSummary: covSummaryPath
} );

// Write the report to disk
var reportJSON = JSON.stringify( report, null, 2 );
fs.writeFileSync( reportPath, reportJSON );
log.info( 'Coverage rank report written to %s.', chalk.magenta( reportPath ) );

// Finish
log.info( 'Done!' );
