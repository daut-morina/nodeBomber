define([
    'models/Obstacle',
    'models/BomberMan',
    'models/Bomb',
    'jQuery',
    'jQueryMigrate',
    'jQueryUi',
    'jQueryUiTouchPunch'
], function(Obstacle, BomberMan, Bomb, $) {
    var config;

    var socket;

    var items = {
        bomberMen: [],
        bombs: [],
        obstacles: []
    };
    var localBomberMan;

    var self;

    var playgroundCanvas = {};

    function GameHandler(initSocket) {
        socket = initSocket;

        self = this;

        console.log('Game has been started.');

        this.setSocketListeners();
    }

    GameHandler.prototype.setSocketListeners = function() {
        socket.on("load config", function(data) {
            config = data;

            playgroundCanvas.height = config.playground.height * config.fieldSize;
            playgroundCanvas.width = config.playground.width * config.fieldSize;
        });

        socket.on("set map", function(data) {
            var obstacle;

            for (var i = 0; i < data.length; ++i) {
                obstacle = data[i];

                items.obstacles.push(new Obstacle(obstacle.id, obstacle.x, obstacle.y, obstacle.size, socket, obstacle.destroyable));
            }
            items.obstacles = data;

            console.log(data);
        });

        socket.on("set bombermen", function(data) {
            for (var i = 0; i < data.length; ++i) {
                if (socket.socket.sessionid === data[i].id) {
                    localBomberMan = data[i];
                }
            }

            items.bomberMen = data;

            console.log(data);

            self.setController();
        });

        socket.on("update bomberman", function(data) {
            if (socket.socket.sessionid !== data.id) {
                var bomberMan = self.getItemById(data.id, items.bomberMen);

                if (!bomberMan) {
                    return;
                }

                bomberMan.x = data.x;
                bomberMan.y = data.y;

                console.log(bomberMan);
            }
        });

        socket.on("new bomb", function(data) {
            if (!self.getItemById(data.id, items.obstacles)) {
                var bomb = new Bomb(data.id, data.x, data.y, config.fieldSize, socket, items);
                //items.bombs.push(bomb);
                items.obstacles.push(bomb);
            }
        });
    };

    GameHandler.prototype.setController = function() {
        $(function() {
            $("#controller").draggable({ containment: "#controllerContainer", scroll: false, revert: true });
            $("#button").click(function() {
                var bomb = new Bomb(localBomberMan.id + (new Date().getTime()), localBomberMan.x, localBomberMan.y, config.fieldSize, socket, items);
                //items.bombs.push(bomb);
                items.obstacles.push(bomb);
                socket.emit("new bomb", { id: bomb.id, x: bomb.x, y: bomb.y });
            });
        });

        setInterval(function() {
            var controllerOffset = $('#controller').offset();
            var polarCoordinates = self.getPolarCoordinates(controllerOffset.left, controllerOffset.top);

            if (polarCoordinates.r >= 10) {
                console.log(localBomberMan);
                if (polarCoordinates.angle >= 315 || polarCoordinates.angle < 45) {
                    if (self.isAllowedToMoveRight()) {
                        localBomberMan.x = localBomberMan.x + 5;
                    }
                } else if (polarCoordinates.angle >= 45 && polarCoordinates.angle < 135) {
                    if (self.isAllowedToMoveDown()) {
                        localBomberMan.y = localBomberMan.y + 5;
                    }
                } else if (polarCoordinates.angle >= 135 && polarCoordinates.angle < 225) {
                    if (self.isAllowedToMoveLeft()) {
                        localBomberMan.x = localBomberMan.x - 5;
                    }
                } else if (polarCoordinates.angle >= 225 && polarCoordinates.angle < 315) {
                    if (self.isAllowedToMoveUp()) {
                        localBomberMan.y = localBomberMan.y - 5;
                    }
                }

                socket.emit("update bomberman", { id: localBomberMan.id, x: localBomberMan.x, y: localBomberMan.y });
            }
        }, 1000 / 30);
    };

    GameHandler.prototype.getPolarCoordinates = function(left, top) {
        var x = left - 75;
        var y = top - 175;

        var r = Math.abs(Math.sqrt((Math.pow(x, 2) + Math.pow(y, 2))));

        var angle = Math.atan(y / x);

        if (x < 0) {
            angle += Math.PI;
        } else if (y < 0) {
            angle += Math.PI * 2;
        }

        return {
            r: r,
            angle: (angle / Math.PI * 180)
        }
    };

    GameHandler.prototype.isAllowedToMoveRight = function() {
        if (!(playgroundCanvas.width - config.fieldSize < localBomberMan.x + 5)) {
            for (var i = 0; i < items.obstacles.length; ++i) {
                if (localBomberMan.x + config.fieldSize == items.obstacles[i].x) {
                    if ((items.obstacles[i].y <= localBomberMan.y && items.obstacles[i].y + config.fieldSize > localBomberMan.y) ||
                        (items.obstacles[i].y < localBomberMan.y + config.fieldSize && items.obstacles[i].y + config.fieldSize > localBomberMan.y + config.fieldSize)) {

                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    };

    GameHandler.prototype.isAllowedToMoveDown = function() {
        if (!(playgroundCanvas.height - config.fieldSize < localBomberMan.y + 5)) {
            for (var i = 0; i < items.obstacles.length; ++i) {
                if (localBomberMan.y + config.fieldSize == items.obstacles[i].y) {
                    if ((items.obstacles[i].x <= localBomberMan.x && items.obstacles[i].x + config.fieldSize > localBomberMan.x) ||
                        (items.obstacles[i].x < localBomberMan.x + config.fieldSize && items.obstacles[i].x + config.fieldSize > localBomberMan.x + config.fieldSize)) {

                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    };

    GameHandler.prototype.isAllowedToMoveLeft = function() {
        if (!(0 > localBomberMan.x - 5)) {
            for (var i = 0; i < items.obstacles.length; ++i) {
                if (localBomberMan.x == items.obstacles[i].x + config.fieldSize) {
                    if ((items.obstacles[i].y <= localBomberMan.y && items.obstacles[i].y + config.fieldSize > localBomberMan.y) ||
                        (items.obstacles[i].y < localBomberMan.y + config.fieldSize && items.obstacles[i].y + config.fieldSize > localBomberMan.y + config.fieldSize)) {

                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    };

    GameHandler.prototype.isAllowedToMoveUp = function() {
        if (!(0 > localBomberMan.y - 5)) {
            for (var i = 0; i < items.obstacles.length; ++i) {
                if (localBomberMan.y == items.obstacles[i].y + config.fieldSize) {
                    if ((items.obstacles[i].x <= localBomberMan.x && items.obstacles[i].x + config.fieldSize > localBomberMan.x) ||
                        (items.obstacles[i].x < localBomberMan.x + config.fieldSize && items.obstacles[i].x + config.fieldSize > localBomberMan.x + config.fieldSize)) {

                        return false;
                    }
                }
            }

            return true;
        }

        return false;
    };

    GameHandler.prototype.getItemById = function(id, array) {
        for (var i = 0; i < array.length; ++i) {
            if (id === array[i].id) {
                return array[i];
            }
        }

        return false;
    };

    return GameHandler;
});
