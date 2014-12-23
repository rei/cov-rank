'use strict';

var winston = require( 'winston' );
var pkg     = require( '../package.json' );

/**
* Return a configured logger prefixed with the package name + label, or just the
* package name.
* @param {string} [label] - The label prefix to add to the package name
*/
module.exports = function ( label ) {
    return new (winston.Logger)( {
        transports: [
            new (winston.transports.Console)( {
                label: !! label ? pkg.name + '/' + label : pkg.name
            } )
        ]
    } );
};
