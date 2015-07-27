// var storage = require('./database/datastore');


// var startCrawl = function startCrawl(patreonUsername, cb) {
//     console.log('crawling user', patreonUsername);
//     return cb(null);
// };

// var receivePatreonUsername = function getPatreonUsername(patreonUsername, cb) {
//     // See if it already exists in database
//     storage.checkUserExists(patreonUsername, function(err, exists) {
//         if (err) throw err;
//         if (exists === 0) return cb(null, false);
//         startCrawl(patreonUsername, function(err) {
//             if (err) throw err;
//             return cb(null, true);
//         });
//     });


// // if new
//     //   que initial crawl

// // if old
// //   do nothing

// };

// var status = 0;


// module.exports = {
// 	startCrawl: startCrawl,
// 	receivePatreonUsername: receivePatreonUsername,
// 	status: status
// };


var patreon = require('../patreon/index');
var queue = require('../queue/index');
var db = require('../database/datastore');


// var patreon = new Patreon('');

module.exports = function dispatch(io) {

    io.on('connection', function(socket) {
        console.log('connection ');
        socket.emit('news', {
            status: 0
        });

        socket.on('newUser', function(data) {
            var username = data.username;
            console.log('received user', username);

            // queue a job to crawl the patreon creator
            queue.push({
                creatorName: username
            }, 5, function(err) {
                if (err) {
                    console.error('couldn\'t queue', username, err);
                    return socket.emit('newUser', {
                        response: 0,
                        message: "problem getting patrons!"
                    });
                }

                console.log('no errors queueing');

                db.getCreatorPatrons(username, function(err, patrons) {
                    if (err) throw err;
                    
                    console.log('got patrons: ', patrons);

                    return socket.emit('newUser', {
                        response: 1,
                        message: 'retreived patrons',
                        patronCount: patrons.length
                    });
                });
            });
        });
    });
};