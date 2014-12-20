function Meta( src ) {
    this.socket = src;
}

Meta.prototype = {

    getSrc: function(){
        return this.src;
    },

    setSrc: function( src ){
        this.src = src;
    },

    setDuration: function( duration ){
        this.duration = duration;
    },

    getDuration: function(){
        return this.duration || 0;
    },

    setCurrentTime: function( time ){
        this.currentTime = time;
    },

    getCurrentTime: function(){
        return this.currentTime || 0;
    }

};

module.exports = Meta;