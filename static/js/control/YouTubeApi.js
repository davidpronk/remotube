define(
    [
        '/static/js/vendor/stapes-0.8.1.min.js',
        'jquery'
    ],
    function( Stapes, $ ) {

        'use strict';

        var YouTubeApi = Stapes.subclass({

            // youTube API v3: AIzaSyDoCdhHaeR8lI44vUoKidB0kjSHvDIHpsA
            // https://console.developers.google.com/project/remot-ube-001/apiui/credential

            constructor: function () {

            },

            getMeta: function( ytId ){

                var deferred = $.Deferred();

                var url = 'https://www.googleapis.com/youtube/v3/videos?id=' + ytId + '&key=AIzaSyDoCdhHaeR8lI44vUoKidB0kjSHvDIHpsA&part=snippet';

                $.get( url)
                .done( function( data ){
                    deferred.resolve( data );
                })
                .fail( function( e ){
                    deferred.reject( e );
                });

                return deferred.promise();


                //var ytId = getURLParameter( 'v', src );
                //
                ///**
                // * key:               AIzaSyDoCdhHaeR8lI44vUoKidB0kjSHvDIHpsA
                // * youTube id(v):     id=YLmCLYojNGI
                // * part:              part=contentDetails
                // * fields(optional):  *
                // *
                // */
                //


            }

        });

        return YouTubeApi;

    }
);