var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');



var events = require('./webui/events')(io);  // handles events sent from client
var ui = require('./webui/serve')(app);         // serves ui to client



server.listen(process.env.PORT);