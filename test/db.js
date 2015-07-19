var expect = require('chai').expect;
var path = require('path');



var db = require('../database/datastore');
var redis = require('redis');
var red = redis.createClient();


describe('Database', function() {

    this.timeout(1000 * 6);
    
    var db;
    var redis;
    var red;


    before(function() {
        db = require('../database/datastore');
        redis = require('redis');
        red = redis.createClient();
    });
    
    
    beforeEach(function(done) {
    	db.clearTestData(function(err) {
    	    expect(err).to.be.null;
    	    done();
    	});
    });
    
    
    it('tests should start with clean slate', function(done) {
	db.clearTestData(function(err) {
	    expect(err).to.be.null;
	
            red.EXISTS('patreon:__alertreontest:patronsAllTime', function(err, reply) {
		expect(reply).to.equal(0);
		
		red.EXISTS('patreon:__alertreontest:patronsCurrent', function(err, reply) {
                    expect(reply).to.equal(0);
		    done();
		});
            });
        });
    });

    
    it('should add specified patron to the two sets', function(done) {
	// simulates how patron would be added to db in an initial crawl
	db.addCreatorPatron('__alertreontest', '__plainjane', function(err, response) {
	    expect(err).to.equal(null);
	    expect(response).to.equal(0);
	    done();
	});
    });


    it('unpledging should remove a patron from only the current patrons set', function(done) {
	db.logCreatorPatron('__alertreontest', '__plainjane', function(err, response) {
	    expect(err).to.equal(null);
	    expect(response.status).to.equal(0);
	
	    db.unpledgeCreatorPatron('__alertreontest', '__plainjane', function(err, response) {
		expect(err).to.equal(null);
		expect(response).to.equal(0);

		red.SISMEMBER('patreon:__alertreontest:patronsCurrent', '__plainjane', function(err, isMember) {
		    expect(err).to.equal(null);
		    expect(isMember).to.equal(0);

		    red.SISMEMBER('patreon:__alertreontest:patronsAllTime', '__plainjane', function(err, isMember) {
			expect(err).to.equal(null);
			expect(isMember).to.equal(1);
			done();
		    });
		});
	    });
	});
    });


    it('should add a new patron to the database if they\'re new', function(done) {
	// simulates how patrons found during routine checks would be compared to known patrons
        db.logCreatorPatron('__alertreontest', '__plainpete', function(err, response) {
            expect(err).to.equal(null);
            expect(response.status).to.equal(0);

            red.SISMEMBER('patreon:__alertreontest:patronsAllTime', '__plainpete', function(err, isMember) {
                expect(err).to.equal(null);
                expect(isMember).to.equal(1);

		red.SISMEMBER('patreon:__alertreontest:patronsCurrent', '__plainpete', function(err, isMember) {
		    expect(err).to.equal(null);
		    expect(isMember).to.equal(1);
                    done();
		    
		});
            });
        });
    });
    
    
    it('should detect a new patron', function(done) {
	db.getCreatorPatronType('__alertreontest', '__newnancy', function(err, response) {
	    expect(err).to.equal(null);
	    expect(response).to.equal('new');
	    done();
        });
    });
    

    it('should detect a returning patron', function(done) {
	db.logCreatorPatron('__alertreontest', '__rogerresub', function(err, response) {
            expect(err).to.equal(null);
            expect(response.status).to.equal(0);

	    db.unpledgeCreatorPatron('__alertreontest', '__rogerresub', function(err, response) {
		expect(err).to.equal(null);
		expect(response).to.equal(0);
		
		db.logCreatorPatron('__alertreontest', '__rogerresub', function(err, response) {
		    expect(err).to.equal(null);
		    expect(response.type).to.equal('renew');
		    done();
		});	
	    });
	});
    });

    
});