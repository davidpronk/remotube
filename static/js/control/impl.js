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
        'js/control/Controller',
        'js/control/YouTubeApi',
        'jquery'
    ],

    function( SocketIO, Controller, YouTubeApi, $ ){

        var loc = document.location,
            path = '/control',
            connectTo = path;

        if( loc.hostname.indexOf( 'rhcloud' ) !== -1 ){
            connectTo = loc.protocol + '//' + loc.hostname + ':8000' + path;
        }

        var playerId = getURLParameter( 'id' );
        var socket = SocketIO.connect( connectTo, {
            query: 'playerId=' + playerId
        });

        var youTubeApi;

        var $status = $( '#status' );
        var $playButton = $( 'button#play' );
        var $pauseButton = $( 'button#pause' );
        var $youTubeUrl = $( '.youTubeUrl' );
        var $formInput = $( '#formInput' );
        var $currentTime = $( '#currentTime' );
        var $duration = $( '#duration' );
        var $scrubber = $( '#scrubber' );
        var $progress = $( '#progress' );
        var $title = $( '#title' );
        var $description = $( '#description' );
        var $thumb = $( '#thumb' );

        var duration = 0;
        var paused = true;

        $pauseButton.hide();
        $scrubber.bind( 'mousedown', handleScrubber );

        $youTubeUrl.on( 'click', function( e ){
            e.preventDefault();
            e.stopPropagation();
            var url = $( e.currentTarget ).attr( 'href' );
            $formInput.attr( 'value', url );
            setSrc( url );
        });

        $( 'button' ).on( 'click', function( e ){

            var cmd = $( e.currentTarget ).data( 'cmd' );

            switch( cmd ){

                case 'setsrc':
                    setSrc( $( $formInput ).val() );
                    break;

                default:
                    socket.emit( 'order', {
                        cmd: cmd,
                        playerId: playerId
                    });
                    break;

            }

        });

        socket.on( 'durationchange', function( newDuration ){
            duration = newDuration;
            $duration.html( secToHMS( newDuration) );
        });

        socket.on( 'playing', function(){
            $status.html( '(playing)' );
            $playButton.hide();
            $pauseButton.show();
            paused = false;
        });

        socket.on( 'paused', function(){
            $status.html( '(paused)' );
            $pauseButton.hide();
            $playButton.show();
            paused = true;
        });

        socket.on( 'timeupdate', function( time ){
            $currentTime.html( secToHMS( time ) );

            // pause also causes an occasional timeupdate
            if( !paused ){
                $playButton.hide();
                $pauseButton.show();
            }
        });

        socket.on( 'srcset', function( src ){

            if( !youTubeApi ){
                youTubeApi = new YouTubeApi();
            }

            youTubeApi.getMeta( src )

                .then( function( data ){
                    processData( data );
                });

        });

        function processData( data ) {

            if( !data.items.length ){
                return;
            }

            var snippet = data.items[0].snippet;

            if ( snippet ) {
                $title.html(snippet.title || '');
                $description.html(snippet.description || '');

                if( snippet.thumbnails && snippet.thumbnails.default ){
                    $thumb.html( '<img src="' + snippet.thumbnails.default.url + '">' );
                } else {
                    $thumb.html( '' );
                }

                //thumbnails.default.width
                //thumbnails.default.height
            }
        }

        socket.on( 'timeupdate', handleTimeUpdate );

        socket.on( 'vout', function( error ){
            $( '#status' ).html( error );
        });

        function handleTimeUpdate( time ) {
            var percent = time / duration;
            updateProgress( percent );
        }

        function handleScrubber( e ) {
            var $this = $( this );
            var x = e.pageX - $this.offset().left;
            var percent = x / $this.width();
            setTime( percent );
        }

        function updateProgress( percent ) {
            $progress.width( ( percent * 100 ) + '%' );
        }

        function setTime( percent ) {
            var time = percent * duration;

            socket.emit( 'order', {
                cmd: 'setcurrenttime',
                playerId: playerId,
                time: time
            });

        }

        function setSrc( src ){
            socket.emit( 'order', {
                cmd: 'setsrc',
                playerId: playerId,
                src: src
            });
        }

        function getURLParameter( name, input ) {
            input = input || location.search;
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec( input )||[,""])[1].replace(/\+/g, '%20'))||null;
        }

        function secToHMS( sec ) {

            sec = Math.floor( sec );

            var hours = parseInt( sec / 3600) % 24;
            var minutes = parseInt( sec / 60) % 60;
            var seconds = sec % 60;

            return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
        }

    }
);