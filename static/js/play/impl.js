require(

    {
        baseUrl: 'static/',
        paths: {
            jquery: 'js/vendor/jquery-2.1.1.min',
            socketio: '/socket.io/socket.io.js'
        }

    },

    [
        'socketio',
        'js/play/YouTubePlayer',
        'jquery',
        'js/vendor/qrcode.min',
        'js/vendor/bootstrap-3.3.1.min'
    ],

    function( SocketIO, youTubePlayer, $ ){

        'use strict';

        var playerNode = document.getElementById( 'player' );
        var player = new youTubePlayer();
        var socket = SocketIO.connect( '/play' );

        player.createCanvas( playerNode );

        player.on( 'timeupdate', function( time ){
            socket.emit( 'timeupdate', time );
        });

        player.on( 'durationchange', function( duration ){
            socket.emit( 'durationchange', duration );
        });

        player.on( 'playing', function(){
            socket.emit( 'playing' );
        });

        player.on( 'paused', function(){
            socket.emit( 'paused' );
        });

        player.on( 'srcset', function( src ){
            socket.emit( 'srcset', src );
        });

        socket.on( 'init', function( id ){
            $( '#link' ).attr( 'href', '/control?id=' + id );
            createQR( id );
        });

        function createQR( id ){

            var qrcode = new QRCode( 'qr', {
                text: document.location.href + 'control?id=' + id,
                width: 128,
                height: 128,
                colorDark : '#000000',
                colorLight : '#ffffff',
                correctLevel : QRCode.CorrectLevel.H
            });

        }

        socket.on( 'play', function () {
            $( '#cmd' ).html( 'playing' );
            player.playVideo();
        });

        socket.on( 'pause', function () {
            $( '#cmd' ).html( 'paused' );
            player.pauseVideo();
        });

        socket.on( 'mute', function () {
            $( '#cmd' ).html( 'mute' );
        });

        socket.on( 'setsrc', function( src ){
            player.setSrc( src );
        });

        socket.on( 'setcurrenttime', function( time ){
            player.setCurrentTime( time );
        });
    }
);