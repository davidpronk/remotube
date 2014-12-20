function Control( id, playerId, socket ){
    this.id = id;
    this.playerId = playerId;
    this.socket = socket;
}

Control.prototype = {

    getId: function(){
        return this.id;
    },

    getPlayerId: function(){
        return this.playerId;
    },

    getSocket: function(){
        return this.socket;
    }

};

module.exports = Control;