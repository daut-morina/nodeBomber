require.config({
    shim: {
        'config': {
            exports: 'config'
        },
        'socketio': {
            exports: 'io'
        }
    },
    paths: {
        config: './config',
        socketio: '../socket.io/socket.io'
    }
});

define(['socketio', 'Game'], function(io, Game) {

    var socket = io.connect(window.location.hostname);

    new Game(socket);
});