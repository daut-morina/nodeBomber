var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000);
var io = require('socket.io').listen(server);

var routes = require('./routes');
var db = require('./models');

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
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

app.get('/playground', function(req, res) {
    res.send('This is going to be the playground');
});

/**************************************************
 ** SOCKETS
 **************************************************/

io.sockets.on('connection', function (socket) {
    console.log(io.transports[socket.id].name);
    socket.emit('news', { hello: 'world'});


    socket.on('my other event', function (data) {
        console.log(data);
    });

    socket.on('bomb drop', function(data) {
        console.log(data);
        socket.broadcast.emit('draw bomb');
    });
});

/**************************************************
 ** EXPORT
 **************************************************/

exports = module.exports = app;