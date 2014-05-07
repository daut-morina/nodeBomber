define(['./config', 'models/Obstacle', 'models/Bomberman', 'models/Bomb'], function(config, Obstacle, BomberMan, Bomb) {
    var socket;

    var obstacles = [];
    var bombs = [];
    var localBomberMan;
    var remoteBomberMen = [];

    var canvas = {};
    var context = {};

    var self;

    var getPlayerById = function(id) {
        for (var i = 0; i < remoteBomberMen.length; ++i) {
            if (id == remoteBomberMen[i].id) {
                return remoteBomberMen[i];
            }
        }

        return false;
    };

    var animateGame = function() {
        context.bomberManContext.clearRect(0, 0, canvas.bomberManCanvas.width, canvas.bomberManCanvas.height);

        localBomberMan.draw(context.bomberManContext);

        for (var i = 0; i < remoteBomberMen.length; ++i) {
            remoteBomberMen[i].draw(context.bomberManContext);
        }

        for (var i = 0; i < bombs.length; ++i) {
            bombs[i].drawBomb(context.bomberManContext);

            if (bombs[i].detonated) {
                bombs.splice(i, 1);
            }
        }

        window.requestAnimationFrame(animateGame);
    };

    function Game(localSocket) {
        self = this;
        socket = localSocket;

        this.loadObstacleMap();
        this.loadBomberManMap();
        this.loadSocketListeners();
        this.loadKeyListeners();
    }

    Game.prototype.loadObstacleMap = function() {
        var map = config.map;
        var mapFieldSize = config.fieldSize;
        var mapHeight = config.playground.height * mapFieldSize;
        var mapWidth = config.playground.width * mapFieldSize;
        var x = 0;
        var y = 0;

        var obstacleCanvas = document.getElementById("obstacleCanvas");
        var obstacleContext = obstacleCanvas.getContext("2d");

        obstacleCanvas.width = mapWidth;
        obstacleCanvas.height = mapHeight;

        for (var i = 0; i < map.length; ++i) {
            switch (map[i]) {
                case 1:
                    obstacles.push(new Obstacle(x % mapWidth, y, mapFieldSize, '#a3a3a3', false));
                    x += mapFieldSize;
                    break;
                case 2:
                    obstacles.push(new Obstacle(x % mapWidth, y, mapFieldSize, '#d8d8d8', true));
                    x += mapFieldSize;
                    break;
                default:
                    x += mapFieldSize;
                    break;
            }

            if (x % mapWidth === 0) {
                y += mapFieldSize;
            }
        }

        for (var i = 0; i < obstacles.length; ++i) {
            obstacles[i].draw(obstacleContext);
        }

        canvas.obstacleCanvas = obstacleCanvas;
        context.obstacleContext = obstacleContext;
    };

    Game.prototype.loadBomberManMap = function() {
        var mapFieldSize = config.fieldSize;
        var mapHeight = config.playground.height * mapFieldSize;
        var mapWidth = config.playground.width * mapFieldSize;

        var bomberManCanvas = document.getElementById("bomberManCanvas");
        var bomberManContext = bomberManCanvas.getContext("2d");

        bomberManCanvas.width = mapWidth;
        bomberManCanvas.height = mapHeight;

        canvas.bomberManCanvas = bomberManCanvas;
        context.bomberManContext = bomberManContext;
    };

    Game.prototype.loadSocketListeners = function() {
        socket.on("player", function(data) {
            localBomberMan = new BomberMan(data.x, data.y, config.fieldSize, data.color);
            localBomberMan.id = data.id;
            animateGame();
        });

        socket.on("disconnect", function(data) {
            var removedPlayer = getPlayerById(data.id);

            if (!removedPlayer) {
                return;
            }

            remotePlayers.splice(remotePlayers.indexOf(removedPlayer), 1);
        });

        socket.on("new player", function(data) {
            var newBomberMan = new BomberMan(data.x, data.y, config.fieldSize, data.color);
            newBomberMan.id = data.id;

            remoteBomberMen.push(newBomberMan);
        });

        socket.on("update player positions", function(data) {
            var movedPlayer = getPlayerById(data.id);

            if (!movedPlayer) {
                return 1; //returns 1
            };

            movedPlayer.x = data.x;
            movedPlayer.y = data.y;
        });

        socket.on("new bomb", function(data) {
            bombs.push(new Bomb(data.x, data.y, config.fieldSize, '#FF0000', obstacles, context.obstacleContext));
        });
    };

    Game.prototype.loadKeyListeners = function() {
        window.onkeydown = function(e) {
            var key = e.keyCode ? e.keyCode : e.which;
            var allowedToMove = true;

            switch(key) {
                case 37: //left
                    if (!(0 > localBomberMan.x - 5)) {
                        // with different x-values, no collision is possible
                        for (var i = 0; i < obstacles.length; ++i) {
                            // compare left edge of player with right edge of obstacle
                            if (localBomberMan.x == obstacles[i].x + config.fieldSize) {
                                if ((obstacles[i].y <= localBomberMan.y && obstacles[i].y + config.fieldSize > localBomberMan.y) |
                                    (obstacles[i].y < localBomberMan.y + config.fieldSize && obstacles[i].y + config.fieldSize > localBomberMan.y + config.fieldSize)) {

                                    allowedToMove = false;
                                    break;
                                }
                            }
                        }
                        if (allowedToMove) {
                            localBomberMan.x = localBomberMan.x - 5;
                        }
                    }
                    break;
                //up
                case 38:
                    if (!(0 > localBomberMan.y - 5)) {
                        // with different y-values, no collision is possible
                        for (var i = 0; i < obstacles.length; ++i) {
                            // compare upper edge of player with bottom edge of obstacle
                            if (localBomberMan.y == obstacles[i].y + config.fieldSize) {
                                if ((obstacles[i].x <= localBomberMan.x && obstacles[i].x + config.fieldSize > localBomberMan.x) |
                                    (obstacles[i].x < localBomberMan.x + config.fieldSize && obstacles[i].x + config.fieldSize > localBomberMan.x + config.fieldSize)) {

                                    allowedToMove = false;
                                    break;
                                }
                            }
                        }
                        if (allowedToMove) {
                            localBomberMan.y = localBomberMan.y - 5;
                        }
                    }
                    break;
                //right
                case 39:
                    if (!(bomberManCanvas.width - config.fieldSize < localBomberMan.x + 5)) {
                        // with different x-values, no collision is possible
                        for (var i = 0; i < obstacles.length; ++i) {
                            // compare right edge of player with left edge of obstacle
                            if (localBomberMan.x + config.fieldSize == obstacles[i].x) {
                                if ((obstacles[i].y <= localBomberMan.y && obstacles[i].y + config.fieldSize > localBomberMan.y) |
                                    (obstacles[i].y < localBomberMan.y + config.fieldSize && obstacles[i].y + config.fieldSize > localBomberMan.y + config.fieldSize)) {

                                    allowedToMove = false;
                                    break;
                                }
                            }
                        }
                        if (allowedToMove) {
                            localBomberMan.x = localBomberMan.x + 5;
                        }
                    }
                    break;
                //down
                case 40:
                    if (!(bomberManCanvas.height - config.fieldSize < localBomberMan.y + 5)) {
                        // with different y-values, no collision is possible
                        for (var i = 0; i < obstacles.length; ++i) {
                            // compare bottom edge of player with upper edge of obstacle
                            if (localBomberMan.y + config.fieldSize == obstacles[i].y) {
                                if ((obstacles[i].x <= localBomberMan.x && obstacles[i].x + config.fieldSize > localBomberMan.x) |
                                    (obstacles[i].x < localBomberMan.x + config.fieldSize && obstacles[i].x + config.fieldSize > localBomberMan.x + config.fieldSize)) {

                                    allowedToMove = false;
                                    break;
                                }
                            }
                        }
                        if (allowedToMove) {
                            localBomberMan.y = localBomberMan.y + 5;
                        }
                    }
                    break;
                case 32:
                    bomb = new Bomb(localBomberMan.x, localBomberMan.y, config.fieldSize, '#FF0000', obstacles, context.obstacleContext);
                    bombs.push(bomb);
                    socket.emit("new bomb", bomb);
                    break;
            }

            socket.emit("update player positions", { id: localBomberMan.id, x: localBomberMan.x, y: localBomberMan.y });
        };
    }

    return Game;
});

