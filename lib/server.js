var path = require('path');
var express = require('express');
var app = module.exports = express();
var server = require('http').createServer(app);
//var red = require('redis').createClient();
var db = require(path.join('..', 'database', 'datastore'));


var io = require('socket.io')(server, {
    'serveClient': true
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

io.sockets.on('connection', function(socket) {

    //console.log('got connexxion');
    /**
     * alert:create
     *
     * called when we .save() our new alert
     *
     * we listen on model namespace, but emit
     * on the collection namespace
     */

    socket.on('puser:create', function(data, callback) {
        console.log('patreon:create', data);

        db.generateUserId(function(id) {
            
            var json = data;
            json.id = id;
            json = JSON.stringify(json);
            console.log('json: ', json);
                db.addPatreonCreator(data.name, function(err, response) {
                    if (err) {
                        console.error('error adding patreon creator');
                        callback(err, null);
                    }
                    else {
                        if (response.status !== 0) {
                            console.error('adding patreon creator replied NOT OK- ' + response.message + ' ' + response.status);
                            callback(new Error('adding creator patron was NOT OK'), null);
                        }
                        else {
                            console.log('added patreon creator OK', id);
                            socket.emit('pusers:create', data);
                            socket.broadcast.emit('pusers:create', data);
                            callback(null, data);
                        }
                    }
                });
            });
        });

        
        
        // if new
        //   save to db
        // if returning
        //   queue crawl
        //
        // * save to database if new
        // * queue a crawl if not already queued
        // * 


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