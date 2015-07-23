var async = require('async');
var emitter = require('events').EventEmitter;
var patreon = require('../patreon');


var task = function(task, cb) {
    console.log('hello ' + task.creatorName);
    
    patreon.getCreatorPatrons(task.creatorName, function(err, patrons) {
        if (err) return cb(err);
        console.log('task', task.creatorName, 'completed.');
        return cb(null);
    });
};

var q = async.priorityQueue(task, 1); // 1 worker



// assign a callback 
q.drain = function() {
    console.log('all items have been processed');
};

// add some items to the queue 
q.push({creatorName: 'josi'}, 1, function (err) {
    if (err) console.error(err);
    console.log('finished processing foo');
});

q.push({creatorName: 'starexorcist'}, 2, function (err) {
    if (err) console.error(err);
    console.log('finished processing bar');
});


// // add some items to the front of the queue 
// q.unshift({name: 'bar'}, function (err) {
//     console.log('finished processing bar');
// });


module.exports = q;