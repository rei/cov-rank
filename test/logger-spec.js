'use strict';

var expect  = require( 'chai' ).expect;
var sinon   = require( 'sinon' );
var pequire = require( 'proxyquire' );
var pkg     = require( '../package.json' );

var getLogger = function ( deps ) {
    return pequire( '../lib/logger', deps );
};

describe( 'logger', function () {
    it( 'returns a "default" logger if no prefix provided', function () {
        var loggerSpy           = sinon.spy();
        var consoleTransportSpy = sinon.spy();
        var log                 = getLogger( {
            winston: {
                Logger: loggerSpy,
                transports: {
                    Console: consoleTransportSpy
                }
            }
        } )();

        expect( loggerSpy.calledOnce ).to.be.true;
        expect( loggerSpy.args[ 0 ][ 0 ] )
            .to.deep.equal( { transports: [ {} ] } );

        expect( consoleTransportSpy.calledOnce ).to.be.true;
        expect( consoleTransportSpy.args[ 0 ][ 0 ] )
            .to.deep.equal( { label: pkg.name } );
    } );

    it( 'returns a configured logger', function () {
        var loggerSpy           = sinon.spy();
        var consoleTransportSpy = sinon.spy();
        var log                 = getLogger( {
            winston: {
                Logger: loggerSpy,
                transports: {
                    Console: consoleTransportSpy
                }
            }
        } )( 'fake-label' );

        expect( loggerSpy.calledOnce ).to.be.true;
        expect( loggerSpy.args[ 0 ][ 0 ] )
            .to.deep.equal( { transports: [ {} ] } );

        expect( consoleTransportSpy.calledOnce ).to.be.true;
        expect( consoleTransportSpy.args[ 0 ][ 0 ] )
            .to.deep.equal( { label: pkg.name + '/fake-label' } );
    } );
} );
