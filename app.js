var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);

var routes = require('./routes');

var GameManager = require('./server/GameManager');

/*  -----
    Configure server
    -----   */

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

/*  -----
    Configure routes
    -----   */

app.get('/', routes.index);
app.get('/playground', routes.playground);

/*  -----
    Start Game Manager
    -----   */

new GameManager(io);