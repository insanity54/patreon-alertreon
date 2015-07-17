var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');
var dispatch = require('./dispatch');


server.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


io.on('connection', function(socket) {
    console.log('connection ');
    socket.emit('news', {
        status: dispatch.status
    });
    
    socket.on('newUser', function(data) {
        var username = data.username;
        console.log('received user', username);
        dispatch.receivePatreonUsername(username, function(err, usr) {
            if (err) throw err;
            if (usr) {
                console.log('this user exists already');
                socket.emit('newUser', {response: 0, message: "patreon user already exists on server"});
            }
            else {
                console.log('this user doesnt exist yet');
                socket.emit('newUser', {response: 1, message: "patreon user added to server"});
            }
        });
    });
});