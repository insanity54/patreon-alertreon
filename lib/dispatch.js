var path = require('path');
var queue = require(path.join('..', 'queue', 'index'));
var db = require(path.join('..', 'database', 'datastore'));



/**
 * putUser
 * 
 * the action to do when a user is PUTted on /user
 * the patreon page is queued for a crawl
 * 
 * @param {String} username - creator's username
 * @param {onPuttedCallback} cb
 */
var putUser = function putUser(username, cb) {
    // queue a job to crawl the patreon creator
    console.error('queue');
    queue.push({
        creatorName: username
    }, 5, function(err) {
        if (err) {
            console.error('couldn\'t queue', username, err);
            return cb(err, null);
        }

        console.log('no errors queueing');

        db.getCreatorPatrons(username, function(err, patrons) {
            if (err) throw err;

            console.log('got patrons: ', patrons);

            return cb(null, {
                message: 'retreived patrons',
                patronCount: patrons.length
            });
        });
    });
};
/**
 * onPuttedCallback
 * 
 * @callback {onPuttedCallback}
 * @param {Error} err
 * @param {object} reply
 * @param {String} reply.message
 * @param {String} reply.patronCount
 */



/**
 * 
 */



module.exports = {
    putUser: putUser
};