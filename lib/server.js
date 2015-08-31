var path = require('path');
var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
var red = require('redis').createClient();

var io = require('socket.io')(server, {'serveClient': true});

app.use(express.static(path.join(__dirname, '..', 'dist')));

io.sockets.on('connection', function (socket) {

  //console.log('got connexxion');
  /**
   * alert:create
   *
   * called when we .save() our new alert
   *
   * we listen on model namespace, but emit
   * on the collection namespace
   */

  socket.on('patreon:create', function (data, callback) {
    //var id = 5;//guid.gen();
    //var alert = db.set('/alert/' + id, data);
    var json = data._attributes;
    console.log('patreon:create', data, ' attrib:', json);
    // if new
    //   save to db
    // if returning
    //   queue crawl
    //
    // * save to database if new
    // * queue a crawl if not already queued
    // * 

    red.get('patreon')

    socket.emit('alerts:create', json);
    socket.broadcast.emit('alerts:create', json);
    callback(null, json);
  });
});



server.listen(process.env.PORT || 3000);
console.log('listening on', process.env.PORT || 3000);
// var path = require('path');
// var express = require('express');
// var app = express();
// var dispatch = require('./dispatch');
// var bodyParser = require('body-parser');

// app.use(bodyParser.json()); // for parsing application/json
// app.use(express.static(path.join('..', 'dist ')));



// app.put('/user', function(req, res) {
//     console.log('received /user PUT');
//     console.log(req.body);
    
//     if (typeof req.body.name != 'undefined') {
//         var name = req.body.name;
//         dispatch.putUser(name, function(err, reply) {
//             if (err) throw err;
//             console.log('done');
//             return res.json({"name": name, "message": "crawl queued"});
//         });
//     }
    
//     else {
//         return res.status(400).json({"message": "no name received"});
//     }
// });


// module.exports = app;