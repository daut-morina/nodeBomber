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

define(['socketio', 'ViewHandler'], function(io, ViewHandler) {
    var socket = io.connect(window.location.hostname + "/playground");

    new ViewHandler(socket);
});