var playerCanvas;
var playerContext;
var controller;
var socket;
var localPlayer;
var players;
var bomb;

var initGame = function() {
    playerCanvas = document.getElementById('playerCanvas');
    playerContext = playerCanvas.getContext('2d');

    controller = new Controller();

    socket = io.connect(window.location.hostname);

    localPlayer = new Player(socket.id, 50, 50);
    bomb = new bomb(socket.id);

    players = [];

    setEventHandlers();
}

var setEventHandlers = function() {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new player', onNewPlayer);
    socket.on('move player', onMovePlayer);
    socket.on('remove player', onRemovePlayer());
};

var onConnect = function() {
    console.log("Connected to socket server.");
    socket.emit('new player', { x: localPlayer.getX(), y: localPlayer.getY() });
}

var onDisconnect = function() {
    console.log("Disconnected from socket server.");
}

var onNewPlayer = function(data) {
    console.log("New player connected: " + data.id);

    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = data.id;

    remotePlayers.push(newPlayer);
}

var onMovePlayer = function(data) {
    var movePlayer = findPlayerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);
};

var onRemovePlayer = function(data) {
    var removePlayer = findPlayerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    }

   players.splice(players.indexOf(removePlayer), 1);
}

var animate = function() {
    update();
    draw();
}

var update = function() {

}

var draw = function() {
    playerContext.clearRect(0, 0, playerCanvas.width, playerCanvas.height);
    localPlayer.draw(playerContext);

    for (var i = 0; i < players.length; ++i) {
        players[i].draw(playerContext);
    }
}

var findPlayerById = function(id) {
    for (var i = 0; i < players.length; ++i) {
        if (players[i].id == id) {
            return players[i];
        }
    }

    return false;
}