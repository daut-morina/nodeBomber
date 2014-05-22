var config = require("./config");
var Player = require("./models/Player").Player;
var Game = require("./Game");
var Bomb = require("./models/Bomb").Bomb;

var GameManager = (function() {
    var io,
        playerIo,
        playgroundIo;

    var socket;

    var playerQueue,
        players;

    var currentGame;

    var self;

    function GameManager(initIo) {
        io = initIo;

        currentGame = null;
        playerQueue = [];
        self = this;

        this.setConnectionHandler();
    }

    GameManager.prototype.setConnectionHandler = function() {
        playerIo = io.of("/player").on("connection", function(initSocket) {
            socket = initSocket;

            socket.emit("load config", config);

            playerQueue.push(new Player(socket));

            socket.on("disconnect", function() {
                var disconnectedPlayer = self.getPlayerById(socket.id);

                if (!disconnectedPlayer) {
                    return;
                }

                playerQueue.splice(playerQueue.indexOf(disconnectedPlayer), 1);
            });

            socket.on("update bomberman", function(data) {
                var bomberMan = self.getBomberManById(data.id);

                if (!bomberMan) {
                    return;
                }

                bomberMan.x = data.x;
                bomberMan.y = data.y;

                io.of("/player").in("players").emit("update bomberman", bomberMan);
                playgroundIo.emit("update bomberman", bomberMan);
            });

            socket.on("new bomb", function(data) {
                console.log(data);
                //currentGame.items.bombs.push(new Bomb(data.id, data.x, data.y, config.fieldSize, "#FF0000"));
                io.of("/player").in("players").emit("new bomb", data);
                playgroundIo.emit("new bomb", data);
            });

            /*
            socket.on("bomb detonating", function(data) {
                playgroundIo.emit("bomb detonating", { id: data.id });
            });

            socket.on("bomb detonated", function(data) {
                playgroundIo.emit("bomb detonating", { id: data.id });
            });
            */

            socket.on("obstacle exploded", function(data) {
                //socket.broadcast.to("players").emit("obstacle exploded", data);
                playgroundIo.emit("obstacle exploded", data);
            });

            socket.on("bomberman hit", function(data) {
                io.of("/player").in("players").emit("bomberman hit", data);
                playgroundIo.emit("bomberman hit", data);
            });
        });

        playgroundIo = io.of('/playground').on("connection", function(socket) {
            socket.emit("load config", config);

            if (currentGame) {
                socket.emit("set map", currentGame.items.obstacles);
                socket.emit("set bombermen", currentGame.items.bomberMen);
            }
        });

        this.getPlayers();
    };

    GameManager.prototype.getPlayers = function() {
        var player;
        var socket;

        if (!currentGame) {
            if (playerQueue.length >= 2) {
                players = [];

                while (players.length < 4 && playerQueue.length > 0) {
                    player = playerQueue.shift();
                    socket = player.socket;

                    if (!player.socket.disconnected) {
                        players.push(player);
                        socket.join("players");
                    }
                }

                self.startGame();
            } else {
                setTimeout(self.getPlayers, 1000);
            }
        } else {
            setTimeout(self.getPlayers, 1000);
        }
    };

    GameManager.prototype.startGame = function() {
        if (!currentGame) {
            var clients = io.of("/player").clients("players");
            for (var i = 0; i < clients.length; ++i) {
                console.log(clients[i]);
            }
            currentGame = new Game(players, io, playerIo, playgroundIo);
        } else {
            setTimeout(self.getPlayers, 1000);
        }
    };

    GameManager.prototype.getBomberManById = function(id) {
        for (var i = 0; i < players.length; ++i) {
            if (id === players[i].socket.id) {
                return players[i].bomberMan;
            }
        }

        return false;
    };

    GameManager.prototype.getPlayerById = function(id) {
        for (var i = 0; i < playerQueue.length; ++i) {
            if (id === playerQueue[i].socket.id) {
                return playerQueue[i];
            }
        }

        return false;
    };

    return GameManager;
})();

exports = module.exports = GameManager;