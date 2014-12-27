'use strict';

var _       = require( 'lodash' );
var expect  = require( 'chai' ).expect;
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' ).noCallThru();
var pkg     = require( '../package.json' );

var happyDeps = {
    util: {
        puts: _.noop
    },
    fs: {
        writeFileSync: _.noop
    },
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
            var utilPutsSpy     = sinon.spy();
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                util: {
                    puts: utilPutsSpy
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( utilPutsSpy.notCalled ).to.be.true;
            expect( logInfoSpy.calledWith( 'Done!' ) ).to.be.true;
        } );

        it( 'outputs the version', function () {
            var utilPutsSpy     = sinon.spy();
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                util: {
                    puts: utilPutsSpy
                },
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
            expect( utilPutsSpy.calledOnce ).to.be.true;
            expect( utilPutsSpy.calledWith( pkg.version ) ).to.be.true;
            expect( logInfoSpy.notCalled ).to.be.true;
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

    describe( '--repo-cov-summary', function () {
        it( 'defaults to "./coverage/coverage-summary.json"' );
        it( 'uses the specified file' );
    } );

    describe( '--report', function () {
        it( 'defaults to "./coverage/coverage-rank.json"' );
        it( 'writes to the specified report file' );
    } );
} );
