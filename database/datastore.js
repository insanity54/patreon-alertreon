var redis = require('redis');
var red = redis.createClient();



// {SET} <id>:patrons       a set containing a creator's patrons
// {SET} users:<id>         a set containing all users





/**
 * detect whether pledge is new or a re-pledge
 */
var getCreatorPatronType = function getCreatorPatronType(creatorName, patronId, cb) {
    red.SISMEMBER('patreon:' + creatorName + ':patronsAllTime', patronId, function(err, reply) {
        if (err) throw err;
        if (reply === 1) {
            // new patron!
            return cb(null, 'new');
        }

        red.SISMEMBER('patreon:' + creatorName + ':patronsCurrent', patronId, function(err, reply) {
            if (err) throw err;
            if (reply === 1) {
                return cb(null, 'renew');
            }
        });
    });


};






var checkUserExists = function checkUserExists(id, cb) {
    red.SISMEMBER('users', id, function(err, reply) {
        if (err) return cb(err, null);
        if (reply === 0) return cb(null, false);
        return cb(null, true);
    });
};

var createUser = function createUser(id, cb) {
    red.ADD(id);
};

var removeUser = function removeUser(id, cb) {
    red.DEL(id);
};


/**
 * this runs for every patron.
 * if the patron is new or renewing, alert is triggered and patron added to db
 * 
 * @param {String} creatorId - id of the creator. ex: 'pomplamoose'
 * @param {String} patronId - id of the patron. ex: '234523 or username'
 * 
 * @param {loggedCallback} cb
 */
var logCreatorPatron = function logCreatorPatron(creatorId, patronId, cb) {

        var response = {};
        getCreatorPatronType(creatorId, patronId, function(err, type) {
            if (err) throw err;

            red.SADD('patreon:' + creatorId + ':patronsCurrent', patronId, function(err) {
                if (err) return cb(err);
                response.status = 0;
                response.type = type;
                return cb(null, response);
            });
        });
    }
    /**
     * loggedCallback
     * 
     * @param {Error} err
     * @param {string} response - 
     */



module.exports = {
    logCreatorPatron: logCreatorPatron,
    removeUser: removeUser,
    checkUserExists: checkUserExists,


}
