define(
    [
        '/static/js/vendor/stapes-0.8.1.min.js'
    ],
    function( Stapes ) {

        'use strict';

        var controller = Stapes.subclass({

            constructor: function () {

            },

            setId: function( id ){
                this.id = id;
            }

        });

        return controller;

    }
);