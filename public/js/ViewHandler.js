define([
    './config',
    'views/ObstacleView',
    'views/BomberManView',
    'views/BombView'
], function(config, ObstacleView, BomberManView, BombView) {
    var socket;

    var items = {
        bomberMen: [],
        bombs: [],
        obstacles: []
    };

    var canvas = {};
    var context = {};

    var self;

    var animateGame = function() {
        context.bomberManContext.clearRect(0, 0, canvas.bomberManCanvas.width, canvas.bomberManCanvas.height);

        for (var i = 0; i < items.bomberMen.length; ++i) {
            items.bomberMen[i].draw(context.bomberManContext);
        }

        for (var i = 0; i < items.bombs.length; ++i) {
            items.bombs[i].drawBomb(context.bomberManContext);

            if (items.bombs[i].detonated) {
                items.bombs.splice(i, 1);
            }
        }

        window.requestAnimationFrame(animateGame);
    };

    function ViewHandler(localSocket) {
        socket = localSocket;

        self = this;

        this.setObstacleCanvas();
        this.setBomberManCanvas();
        this.setSocketListeners();

        animateGame();
    }

    ViewHandler.prototype.setObstacleCanvas = function() {
        var mapFieldSize = config.fieldSize;
        var mapHeight = config.playground.height * mapFieldSize;
        var mapWidth = config.playground.width * mapFieldSize;

        var obstacleCanvas = document.getElementById("obstacleCanvas");
        var obstacleContext = obstacleCanvas.getContext("2d");

        obstacleCanvas.width = mapWidth;
        obstacleCanvas.height = mapHeight;

        canvas.obstacleCanvas = obstacleCanvas;
        context.obstacleContext = obstacleContext;
    };

    ViewHandler.prototype.setBomberManCanvas = function() {
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

    ViewHandler.prototype.setSocketListeners = function() {
        socket.on("set map", function(data) {
            var obstacle;

            for (var i = 0; i < data.length; ++i) {
                obstacle = data[i];
                obstacleObject = new ObstacleView(obstacle.id, obstacle.x, obstacle.y, obstacle.size, obstacle.color);
                obstacleObject.draw(context.obstacleContext);
                items.obstacles.push(obstacleObject);
            }
        });

        socket.on("set bombermen", function(data) {
            var bomberMan;

            for (var i = 0; i < data.length; ++i) {
                bomberMan = data[i];
                items.bomberMen.push(new BomberManView(bomberMan.id, bomberMan.x, bomberMan.y, bomberMan.size, bomberMan.color));
            }
        });

        socket.on("update bomberman", function(data) {
            var bomberMan = self.getBomberManById(data.id);

            if (!bomberMan) {
                return;
            }

            bomberMan.x = data.x;
            bomberMan.y = data.y;
        });

        socket.on("new bomb", function(data) {
            var bomb = new BombView(data.id, data.x, data.y, config.fieldSize, "#FF0000");
            items.bombs.push(bomb);
            console.log(items.bombs);
        });

        /*
        socket.on("bomb detonating", function(data) {
            var bomb = self.getItemById(data.id, items.bombs);

            if (!bomb) {
                return;
            }

            bomb.detonating = true;
        });

        socket.on("bomb detonated", function(data) {
            console.log(data.id + " detonated.");
            var bomb = self.getItemById(data.id, items.bombs);

            if (!bomb) {
                return;
            }

            bomb.detonated = true;
        });
        */

        socket.on("obstacle exploded", function(data) {
            console.log(items.obstacles);
            console.log(data.id + " exploded.");
            var obstacle = self.getItemById(data.id, items.obstacles);

            console.log(obstacle);

            if (!obstacle) {
                return;
            }

            console.log(obstacle);

            obstacle.erase(context.obstacleContext);
            items.obstacles.splice(items.obstacles.indexOf(obstacle), 1);
        });

        socket.on("bomberman hit", function(data) {
            console.log(data);

            var bomberman = self.getItemById(data.id, items.bomberMen);

            if (!bomberman) {
                return;
            }

            items.bomberMen.splice(items.bomberMen.indexOf(bomberman), 1);
        });
    };

    ViewHandler.prototype.getBomberManById = function(id) {
        for (var i = 0; i < items.bomberMen.length; ++i) {
            if (id == items.bomberMen[i].id) {
                return items.bomberMen[i];
            }
        }

        return false;
    };

    ViewHandler.prototype.getItemById = function(id, array) {
        for (var i = 0; i < array.length; ++i) {
            if (id === array[i].id) {
                return array[i];
            }
        }

        return false;
    };

    return ViewHandler;
});
