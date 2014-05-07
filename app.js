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
    app.use('/bower_components', express.static(__dirname + '/bower_components'));
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
var bomberMen = [];

var getPlayerById = function(id) {
    for (var i = 0; i < bomberMen.length; ++i) {
        if (id == bomberMen[i].id) {
            return bomberMen[i];
        }
    }

    return false;
};

var getRandomColor = function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }

    return color;
};

var init = function() {
    players = {
        first: {
            id: 1,
            player: null,
            x: 0,
            y: 0
        },
        second: {
            id: 2,
            player: null,
            x: 600,
            y: 0
        },
        third: {
            id: 3,
            player: null,
            x: 0,
            y: 500
        },
        fourth: {
            id: 4,
            player: null,
            x: 600,
            y: 500
        }
    };

    setEventHandlers();
};

var initPlayer = function(slot, socket) {
    slot.player = new Player(slot.id, slot.x, slot.y, getRandomColor());
    bomberMen.push(slot.player);
    socket.emit("player", { id: slot.id, x: slot.player.x, y: slot.player.y, color: slot.player.color });
    socket.broadcast.emit("new player", { id: slot.id, x: slot.player.x, y: slot.player.y, color: slot.player.color });

    for (var i = 0; i < bomberMen.length; ++i) {
        existingBomberMan = bomberMen[i];
        if (existingBomberMan.id !== slot.id) {
            socket.emit("new player", { id: existingBomberMan.id, x: existingBomberMan.x, y: existingBomberMan.y, color: existingBomberMan.color });
        }
    }
}

var setEventHandlers = function() {
    io.sockets.on("connection", onConnection);
};

var onConnection = function(socket) {
    console.log("### New player has connected: " +  socket.id + " ###");

    if (players.first.player === null) {
        initPlayer(players.first, socket);
    } else if (players.second.player === null) {
        initPlayer(players.second, socket);
    } else if (players.third.player === null) {
        initPlayer(players.third, socket);
    } else if (players.fourth.player === null) {
        initPlayer(players.fourth, socket);
    } else {
        //socket.disconnect();
    }

    socket.on("disconnect", function() {
        var removedPlayer = getPlayerById(socket.id);

        if (!removedPlayer) {
            return;
        }

        players.splice(players.indexOf(removedPlayer), 1);

        //this.broadcast.emit("disconnect", { id: removedPlayer.getId() });
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
        var movedPlayer = getPlayerById(data.id);

        if (!movedPlayer) {
            return;
        }

        movedPlayer.x = data.x;
        movedPlayer.y = data.y;

        socket.broadcast.emit("update player positions", { id: movedPlayer.id, x: movedPlayer.x, y: movedPlayer.y });
    });

    socket.on("new bomb", function(data) {
        socket.broadcast.emit("new bomb", { x: data.x, y: data.y });
    });
};

exports = module.exports = app;

init();