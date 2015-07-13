var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


io.on('connection', function(socket) {
    console.log('connection ');
    socket.emit('news', {
        status: 'world'
    });
    // socket.on('my other event', function(data) {
    //     console.log(data);
    // });
});