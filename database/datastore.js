var redis = require('redis');

// {KEY} <id>:
// {SET} <id>:patrons       a set containing a creator's patrons
// {SET} users:<id>         a set containing all users




module.exports = {
    createUser: function createUser(id, cb) {
	redis.ADD(id);
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

    
	
    