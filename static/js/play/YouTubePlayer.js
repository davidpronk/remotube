define(
    [
        '/static/js/vendor/stapes-0.8.1.min.js'
    ],
    function( Stapes ){

        'use strict';

        var youtubeReady = false;

        var player = Stapes.subclass({

            constructor: function () {

                // https://developers.google.com/youtube/js_api_reference

                this.ytScript = '//www.youtube.com/iframe_api';
                this.playerTime = 0;
                this.playing = false;
                this.duration = 0;

                if ( !window.onYouTubeIframeAPIReady ) {
                    window.onYouTubeIframeAPIReady = function () {
                        youtubeReady = true;
                    };

                    var tag = document.createElement( 'script' );
                    tag.src = this.ytScript;

                    var firstScriptTag = document.getElementsByTagName( 'script' )[0];
                    firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

                }

            },


            createCanvas: function( host ){

                if (!youtubeReady) {
                    setTimeout(function () {
                        this.createCanvas( host );
                    }.bind(this), 200);
                } else {

                    this.player = new YT.Player( host, {
                        width: '640',
                        height: '390',
                        events: {
                            'onError': this.onPlayerError.bind( this ),
                            'onReady': this.onPlayerReady.bind( this ),
                            'onStateChange': this.onPlayerStateChange.bind( this )
                        }
                    });

                }

            },

            onPlayerError: function( e ){
                console.log( 'error: ', e );
            },

            onPlayerReady: function( e ) {

            },

            /**
             *
             *  -1 (unstarted)
             *   0 (ended)
             *   1 (playing)
             *   2 (paused)
             *   3 (buffering)
             *   5 (video cued)
             *
             */
            onPlayerStateChange: function( state ){

                var timer;
                var canvas;
                var loop = false;

                switch ( state.data ) {

                    case -1:

                        this.emit( 'srcset', this.player.getVideoUrl() );

                        this.playing = false;
                        break;

                    case 0:
                        clearInterval( timer );
                        break;

                    case 1:

                        if( !this.playing ){
                            this.playing = true;
                        }

                        this.emit( 'playing' );

                        timer = setInterval( this.updateTime.bind( this ), 500 );
                        timer = setInterval( this.updateDuration.bind( this ), 1000 );

                        break;

                    case 2:

                        this.emit( 'paused' );
                        clearInterval( timer );
                        break;

                    case 5:
                        break;
                }
            },

            updateTime: function() {

                var currentTime = this.player.getCurrentTime();
                if ( this.playerTime !== currentTime ) {
                    this.playerTime = currentTime;

                    this.emit( 'timeupdate', this.playerTime );
                }

            },

            updateDuration: function(){
                var duration = this.getDuration();
                if( this.duration !== duration ){
                    this.duration = duration;
                    this.emit( 'durationchange', duration );
                }
            },

            playVideo: function(){
                this.player.playVideo();
            },

            pauseVideo: function(){
                this.player.pauseVideo();
            },

            setSrc: function( src ){

                if( !src ){
                    return;
                }

                var re = /(\?v=|\/\d\/|\/embed\/|\/v\/|\.be\/)([a-zA-Z0-9\-\_]+)/;
                var id = src.match(re)[2];

                if( id ){
                    this.loadVideoById( id );
                }

            },

            setCurrentTime: function( time ){
                this.player.seekTo( time, true );
            },

            loadVideoByUrl: function( url ){
                this.player.loadVideoByUrl( url, 0, 'default' );
            },

            loadVideoById: function( id ){
                this.player.loadVideoById( id, 0, 'default' );
            },

            getCurrentTime: function(){
                return this.player.getCurrentTime();
            },

            getDuration: function(){
                return this.player.getDuration();
            },

            getTitle: function(){
                return this.player.getVideoData().title;
            },

            getAuthor: function(){
                return this.player.getVideoData().author;
            },

            getVideoId: function(){
                return this.player.getVideoData().video_id;
            }

        });

        return player;

    }
);