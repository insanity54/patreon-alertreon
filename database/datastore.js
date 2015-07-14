var redis = require('redis');
var red = redis.createClient();


// {KEY} <id>:
// {SET} <id>:patrons       a set containing patrons
// {SET} users              a set containing all users




module.exports = {
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
	    red.DEL(id);
    }
};