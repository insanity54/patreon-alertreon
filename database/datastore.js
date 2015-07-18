var redis = require('redis');
var red = redis.createClient();



// {SET} <id>:patrons       a set containing a creator's patrons
// {SET} users:<id>         a set containing all users





module.exports = {

    /**
     * detect whether pledge is new or a re-pledge
     */
    detectCreatorPatronType: function detectCreatorPatronType(creatorName, patronId, cb) {
	red.SISMEMBER('patreon:'+creatorName+':patronsAllTime', patronId, function(err, reply) {
	    if (err) throw err;
	    if (reply === 1) {
		// new patron!
		return cb(null, 'new');
	    }

	    red.SISMEMBER('patreon:'+creatorName+':patronsCurrent', patronId, function(err, reply) {
		if (err) throw err;
		if (reply === 1) {
		    return cb(null, 'renew');
		}
	    });
	});

		      
    },





    
    checkUserExists: function checkUserExists(id, cb) {
        red.SISMEMBER('users', id, function(err, reply) {
            if (err) return cb(err, null);
            if (reply === 0) return cb(null, false);
            return cb(null, true);
        });
    },
    createUser: function createUser(id, cb) {
	    red.ADD(id);
    },
    removeUser: function removeUser(id, cb) {
	redis.DEL(id);
    },
    logCreatorPatron: function logCreatorPatron(creatorId, patronId, cb) {
	redis.SADD(creatorId, patronId, function(err) {
	    if (err) return cb(err);
	    cb(null);
	});
    }
};
