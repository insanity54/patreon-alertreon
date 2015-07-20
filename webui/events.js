


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


module.exports = function events(io) {

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
}