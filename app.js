var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);

var routes = require('./routes');
var Player = require("./Player").Player;

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});

/**************************************************
 ** ROUTES
 **************************************************/

app.get('/', routes.index);

app.get('/playground', routes.playground);

/**************************************************
 ** GAME
 **************************************************/

var players;

var getPlayerById = function(id) {
    for (var i = 0; i < players.length; ++i) {
        if (id == players[i].getId()) {
            return players[i];
        }
    }

    return false;
};

var init = function() {
    players = [];

    setEventHandlers();
};

var setEventHandlers = function() {
    io.sockets.on("connection", onConnection);
};

var onConnection = function(socket) {
    console.log("### New player has connected: " +  socket.id + " ###");

    socket.on("disconnect", function() {
        var removedPlayer = getPlayerById(socket.id);

        if (!removedPlayer) {
            return;
        }

        players.splice(players.indexOf(removedPlayer), 1);

        this.broadcast.emit("disconnect", { id: removedPlayer.getId() });
    });

    socket.on("new player", function(data) {
        var newPlayer = new Player(data.x, data.y, data.color);
        newPlayer.setId(socket.id);

        socket.broadcast.emit("new player", { id: newPlayer.getId(), x: newPlayer.getX(), y: newPlayer.getY(), color: newPlayer.getColor() });

        for (var i = 0; i < players.length; ++i) {
            existingPlayer = players[i];
            socket.emit("new player", { id: existingPlayer.getId(), x: existingPlayer.getX(), y: existingPlayer.getY(), color: existingPlayer.getColor() });
        }

        players.push(newPlayer);
    });

    socket.on("update player positions", function(data) {
        var movedPlayer = getPlayerById(socket.id);

        if (!movedPlayer) {
            return;
        }

        movedPlayer.setX(data.x);
        movedPlayer.setY(data.y);

        socket.broadcast.emit("update player positions", { id: movedPlayer.getId(), x: movedPlayer.getX(), y: movedPlayer.getY() });
    });
};

exports = module.exports = app;

init();