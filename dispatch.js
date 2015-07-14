var storage = require('./database/datastore');


var startCrawl = function startCrawl(patreonUsername, cb) {
    console.log('crawling user', patreonUsername);
    return cb(null);
};

var receivePatreonUsername = function getPatreonUsername(patreonUsername, cb) {
    // See if it already exists in database
    storage.checkUserExists(patreonUsername, function(err, exists) {
        if (err) throw err;
        if (exists === 0) return cb(null, false);
        startCrawl(patreonUsername, function(err) {
            if (err) throw err;
            return cb(null, true);
        });
    });


// if new
    //   que initial crawl

// if old
//   do nothing

};

var status = 0;


module.exports = {
	startCrawl: startCrawl,
	receivePatreonUsername: receivePatreonUsername,
	status: status
};