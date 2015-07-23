var assert = require('chai').assert;


describe('Queue', function() {

    this.timeout(1000 * 60);
    var queue = require('../queue/index');


    it('should return an event emitter', function(done) {

        queue.push({creatorName: 'starexorcist'}, 5, function(err, emitter) {
            assert.equal(err, null, 'there was an error queueing the task');
            assert.instanceOf('EventEmitter', emitter, 'queue did not return an event emitter. got instead: ' + typeof(emitter));
            done();
        });
        
        
        //assert.instanceOf(creator, EventEmitter, 'creator is not an instance of event emitter')

        //creator.on('gotCreatorPatrons', function(err) {
        console.log('error');
    });

    // creator.on('end', function() {
        
    // });
});
