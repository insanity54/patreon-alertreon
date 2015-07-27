var assert = require('chai').assert;
var db = require('../database/datastore');


describe('Queue', function() {

    this.timeout(1000 * 60);
    var queue = require('../queue/index');


    it('should log an array of patrons to the database', function(done) {

	//db.
        queue.push({creatorName: 'starexorcist'}, 5, function(err) {
            assert.equal(err, null, 'there was an error queueing the task');
	    
	    
	    // should callback without error
            // assert.instanceOf('EventEmitter', emitter, 'queue did not return an event emitter. got instead: ' + typeof(emitter));
            done();
        });
        
        
        //assert.instanceOf(creator, EventEmitter, 'creator is not an instance of event emitter')

        //creator.on('gotCreatorPatrons', function(err) {
        //console.log('error');
    });

    // creator.on('end', function() {
        
    // });
});
