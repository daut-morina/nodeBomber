var Player = (function() {
    function Player(socket) {
        this.socket = socket;
    }

    return Player;
})();

exports.Player = Player;