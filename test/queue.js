var assert = require('chai').assert;

describe('Queue', function() {

    this.timeout(1000 * 60);
    var queue = require('../queue/index');


    it('should run a crawl on the received patreon creator', function(done) {
        queue.push({creatorName: 'starexorcist'}, 5, function(err) {
            assert.equal(err, null, 'there was an error queueing the task');
            done();
        });
    });
    
});
