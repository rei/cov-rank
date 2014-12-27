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
    path: {
        join: _.noop,
        sep:  'fake-path-sep'
    },
    fs: {
        writeFileSync: _.noop
    },
    minimist: function () {
        return {
            version: false
        };
    },
    chalk: {
        bold:       function ( s ) { return 'bold:' + s },
        cyan:       function ( s ) { return 'cyan:' + s },
        magenta:    function ( s ) { return 'magenta:' + s },
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

        it( 'defaults to the current directory', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 3 ] ).to.deep.equal( [
                '    Target repo:             %s',
                'magenta:.' + happyDeps.path.sep
            ] );
        } );

        it( 'uses the specified repo path', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                minimist: function () {
                    return {
                        repo: 'fake-repo-path'
                    };
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 3 ] ).to.deep.equal( [
                '    Target repo:             %s',
                'magenta:fake-repo-path'
            ] );
        } );
    } );

    describe( '--repo-test-command', function () {

        it( 'defaults to `npm tst`', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 4 ] ).to.deep.equal( [
                '    Test command:            %s',
                'cyan:npm tst'
            ] );
        }  );

        it( 'uses the specified test command', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                minimist: function () {
                    return {
                        'repo-test-command': 'fake-repo-test-cmd'
                    };
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 4 ] ).to.deep.equal( [
                '    Test command:            %s',
                'cyan:fake-repo-test-cmd'
            ] );
        } );
    } );

    describe( '--repo-cov-summary', function () {

        it( 'defaults to "./coverage/coverage-summary.json"', function () {
            var pathJoinSpy     = sinon.spy( function () {
                return 'fake-path-join-return';
            } );
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                path: {
                    join: pathJoinSpy
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( pathJoinSpy.args[ 0 ] ).to.deep.equal( [
                '.', 'coverage', 'coverage-summary.json'
            ] );
            expect( logInfoSpy.args[ 5 ] ).to.deep.equal( [
                '    Coverage summary path:   %s',
                'magenta:fake-path-join-return'
            ] );
        } );

        it( 'uses the specified file', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                minimist: function () {
                    return {
                        'repo-cov-summary': 'fake-repo-cov-summary'
                    };
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 5 ] ).to.deep.equal( [
                '    Coverage summary path:   %s',
                'magenta:fake-repo-cov-summary'
            ] );
        } );
    } );

    describe( '--report', function () {
        it( 'defaults to "./coverage/coverage-rank.json"', function () {
            var pathJoinSpy     = sinon.spy( function () {
                return 'fake-path-join-return';
            } );
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                path: {
                    join: pathJoinSpy
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( pathJoinSpy.args[ 1 ] ).to.deep.equal( [
                '.', 'coverage', 'coverage-rank.json'
            ] );
            expect( logInfoSpy.args[ 6 ] ).to.deep.equal( [
                '    Rank report path:        %s',
                'magenta:fake-path-join-return'
            ] );
        } );

        it( 'writes to the specified report file', function () {
            var logInfoSpy      = sinon.spy();
            var idx             = getIndex( {
                minimist: function () {
                    return {
                        report: 'fake-report-path'
                    };
                },
                './lib/logger': function () {
                    return {
                        info: logInfoSpy
                    };
                }
            } );
            expect( logInfoSpy.args[ 6 ] ).to.deep.equal( [
                '    Rank report path:        %s',
                'magenta:fake-report-path'
            ] );
        } );
    } );
} );
