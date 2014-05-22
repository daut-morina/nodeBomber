require.config({
    paths: {
        config: './config',
        jQuery: '../bower_components/jquery/dist/jquery.min',
        jQueryMigrate: '../bower_components/jquery-migrate/jquery-migrate.min',
        jQueryUi: '../bower_components/jquery.ui/dist/jquery-ui',
        jQueryUiTouchPunch: '../bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.min',
        socketio: '../socket.io/socket.io'
    },
    shim: {
        'config': {
            exports: 'config'
        },
        'jQuery': {
            exports: '$'
        },
        'jQueryMigrate': {
            exports: '$',
            deps: ['jQuery']
        },
        'jQueryUi': {
            exports: '$',
            deps: ['jQuery']
        },
        'jQueryUiTouchPunch': {
            exports: '$',
            deps: ['jQueryUi']
        },
        'socketio': {
            exports: 'io'
        }
    }
});

define(['socketio', 'GameHandler'], function(io, GameHandler) {
    var socket = io.connect(window.location.hostname + "/player");

    new GameHandler(socket);
});