var config = require("./config");
var Obstacle = require("./models/Obstacle").Obstacle;
var BomberMan = require("./models/BomberMan").BomberMan;

var Game = (function() {
    var gameRunning;
    var io;
    var playerIo;
    var playgroundIo;
    var players;
    var self;

    function Game(initPlayers, initIo, initPlayerIo, initPlaygroundIo) {
        io = initIo;
        players = initPlayers;
        playerIo = initPlayerIo;
        playgroundIo = initPlaygroundIo;
        self = this;
        gameRunning = true;

        this.items = {
            bomberMen: [],
            bombs: [],
            obstacles: []
        };

        console.log("Game started!");

        this.setGame();
    };

    Game.prototype.setGame = function() {
        this.setGameHandlers();
    };

    Game.prototype.setGameHandlers = function() {
        this.setMap();
    };

    Game.prototype.setMap = function() {
        var map = config.map;
        var mapFieldSize = config.fieldSize;
        var mapHeight = config.playground.height * mapFieldSize;
        var mapWidth = config.playground.width * mapFieldSize;
        var obstacles = this.items.obstacles;
        var x = 0;
        var y = 0;

        for (var i = 0; i < map.length; ++i) {
            switch (map[i]) {
                case 1:
                    obstacles.push(new Obstacle(i, x % mapWidth, y, mapFieldSize, '#a3a3a3', false));
                    x += mapFieldSize;
                    break;
                case 2:
                    obstacles.push(new Obstacle(i, x % mapWidth, y, mapFieldSize, '#d8d8d8', true));
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

        playerIo.emit("set map", this.items.obstacles);

        this.setBomberMen();
    };

    Game.prototype.setBomberMen = function() {
        var bomberMan;
        var bomberMen = this.items.bomberMen;

        for (var i = 0; i < players.length; ++i) {
            bomberMan = new BomberMan(players[i].socket.id, config.start[i].x, config.start[i].y, config.fieldSize, this.getRandomColor());
            players[i].bomberMan = bomberMan;
            bomberMen[i] = bomberMan;
            console.log("BomberMan No. " + i + ": " + bomberMan + ", Socket ID: " + players[i].socket.id);
        }

        playerIo.emit("set bombermen", bomberMen);
    };

    Game.prototype.getRandomColor = function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.round(Math.random() * 15)];
        }

        return color;
    };

    return Game;
})();

exports = module.exports = Game;