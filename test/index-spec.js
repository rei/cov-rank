'use strict';

var _       = require( 'lodash' );
var expect  = require( 'chai' ).expect;
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );
var pkg     = require( '../package.json' );

var happyDeps = {
    minimist: function () {
        return {
            version: false
        };
    },
    './lib/logger': function () {
        return {
            info: _.noop
        };
    },
    './lib/generate-report': _.noop
};

var getIndex = function ( overrides ) {
    return pequire( '../index', _.assign( {}, happyDeps, overrides ) );
};

describe( 'index', function () {

    it( 'is accessible via the "cov-rank" command when installed globally', function () {
        expect( pkg.bin[ 'cov-rank' ] ).to.equal( './index.js' );
    } );

    describe( '--version', function () {
        it( 'defaults to false', function () {
            var logInfoSpy  = sinon.spy();
            var idx         = getIndex( {
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.calledOnce ).to.be.true;
            expect( logInfoSpy.calledWith( 'Done!' ) ).to.be.true;
        } );
        it( 'outputs the version', function () {
            var logInfoSpy  = sinon.spy();
            var idx         = getIndex( {
                minimist: function () {
                    return {
                        version: true
                    };
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.calledOnce ).to.be.true;
            expect( logInfoSpy.calledWith( 'v' + pkg.version ) ).to.be.true;
        } );
    } );

    describe( '--repo', function () {
        it( 'defaults to the current directory' );
        it( 'uses the specified directory' );
    } );

    describe( '--repo-test-command', function () {
        it( 'defaults to `npm tst`' );
        it( 'uses the specified test command' );
    } );

    describe( '--repo-cov-report', function () {
        it( 'defaults to "./coverage/coverage-summary.json"' );
        it( 'uses the specified file' );
    } );

    describe( '--report', function () {
        it( 'defaults to "./coverage/coverage-rank.json"' );
        it( 'writes to the specified report file' );
    } );
} );
