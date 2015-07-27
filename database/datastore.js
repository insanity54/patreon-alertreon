var redis = require('redis');
var red = redis.createClient();



// {SET} <id>:patrons       a set containing a creator's patrons
// {SET} users:<id>         a set containing all users


var clearTestData = function clearTestData(cb) {
    red.DEL('patreon:__alertreontest:patronsAllTime', function(err) {
	if (err) return cb(err);
	
	red.DEL('patreon:__alertreontest:patronsCurrent', function(err) {
	    if (err) return cb(err);
	    return cb(null);
	});
    });
}


/**
 * detect whether pledge is new or a re-pledge
 */
var getCreatorPatronType = function getCreatorPatronType(creatorName, patronId, cb) {
    red.SISMEMBER('patreon:' + creatorName + ':patronsAllTime', patronId, function(err, reply) {
        if (err) throw err;
        if (reply === 0) {
            // new patron!
            return cb(null, 'new');
        }

        red.SISMEMBER('patreon:' + creatorName + ':patronsCurrent', patronId, function(err, reply) {
            if (err) throw err;
            if (reply === 0) {
		// renewing patron!
                return cb(null, 'renew');
            }

	    // alert has been generated previously for this patron
	    return cb(null, 0);
        });
    });
};
/**
 *  patronTypeCallback
 *
 *  @param {Error} err
 *  @param {String|boolean} response
 */



var checkCreatorExists = function checkCreatorExists(id, cb) {
    red.EXISTS('patreon:' + id, function(err, exists) {
	if (err) return cb(err);
	return cb(null, exists);
    });
}


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
 * remove patron from the patronsCurrent list.
 * does not remove from te patronsAllTime list
 *
 * @param {String} creatorId
 * @param {String} patronId
 * @param {unpledgedCallback} cb
 */
var unpledgeCreatorPatron = function unpledgeCreatorPatron(creatorId, patronId, cb) {
    red.SREM('patreon:' + creatorId + ':patronsCurrent', patronId, function(err, ok) {
	if (err) throw err;
	if (!ok) return cb(null, 1);
	return cb(null, 0);
    });
}

/**
 * @callback {unpledgedCallback}
 * @param {Error} err
 * @param {boolean} status - 1 if there is a problem, 0 if ok
 */



/**
 * add the patron to the two sets:
 *   patreon:<creatorUsername>:patronsAllTime
 *   patreon:<creatorUsername>:patronsCurrent
 *
 * no testing of patron type takes place, meaning no alerts will be generated.
 * this func is meant to be used for the initial gathering of patrons.
 *
 * @param {String} creatorId - username of the patreon creator
 * @param {String} patronId - patreon user id of the patron to add
 * @param {addedPatronCallback} cb
 */
var addCreatorPatron = function addCreatorPatron(creatorId, patronId, cb) {
    red.SADD('patreon:' + creatorId + ':patronsAllTime', patronId, function(err, ok) {
	if (err) throw err;
	if (!ok) return cb(null, 1);

	red.SADD('patreon:' + creatorId + ':patronsCurrent', patronId, function(err, ok) {
	    if (err) throw err;
	    if (!ok) return cb(null, 1);

	    return cb(null, 0);
	});
    });
}
/**
 * @callback {addedPatronCallback}
 * @param {Error} err
 * @param {int} code - non-zero if there was a problem
 */


/**
 * after the initial crawl, this runs for every patron.
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

	response.type = type; // 'new', 'renew' or '0' (0 is patron that's not a new detection)

	// only add to set if they aren't already in the patronsCurrent set

	// if patron is brand new ('new') add to both sets
	if (type == 'new') {
	    addCreatorPatron(creatorId, patronId, function(err, code) {
		if (err) return cb(err);
		if (code !== 0) return cb(new Error('couldnt add patron to the sets'));
		
		response.status = 0;
		return cb(null, response);
	    });
	}

	// if patron is returning ('renew') add to patronsCurrent set
	else if (type == 'renew') {
            red.SADD('patreon:' + creatorId + ':patronsCurrent', patronId, function(err) {
		if (err) return cb(err);
		response.status = 0;
		return cb(null, response);		
            });
	}
	
	// if patron has already been processed (0) do nothing
	else {
	    response.status = 0;
	    return cb(null, response);
	}
    });
}
/**
 * loggedCallback
 * 
 * @param {Error} err
 * @param {object} response
 * @param {string} response.status - non-zero if problems
 * @param {string} response.type - 'new' or 'renew' which indicates the patron type
 */



module.exports = {
    clearTestData: clearTestData,
    logCreatorPatron: logCreatorPatron,
    removeUser: removeUser,
    checkUserExists: checkUserExists,
    addCreatorPatron: addCreatorPatron,
    unpledgeCreatorPatron: unpledgeCreatorPatron,
    getCreatorPatronType: getCreatorPatronType
}
