var Meta = require( './Meta.js' );

function Player( socket ) {
    this.socket = socket;
    this.playing = false;
    this.meta = new Meta();
}

Player.prototype = {

    getSocket: function(){
        return this.socket;
    },

    addControl: function( control ){
        if( !this.controls ){
            this.controls = [];
        }
        this.controls.push( control );
    },

    getControls: function(){
        return this.controls;
    },

    getMeta: function(){
        return this.meta;
    },

    setPlaying: function( playing ){
        this.playing = playing;
    },

    isPlaying: function(){
        return this.playing;
    }

};

module.exports = Player;