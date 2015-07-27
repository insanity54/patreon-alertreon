var expect = require('chai').expect;
var assert = require('chai').assert;
var path = require('path');



// var db = require('../database/datastore');
// var redis = require('redis');
// var red = redis.createClient();


describe('Database', function() {

    this.timeout(1000 * 6);

    // var db;
    // var redis;
    // var red;


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
    
    
    it('should generate a unique ID for users', function(done) {
        red.SMEMBERS('alertreon:userIds', function(err, originalIds) {
            assert.equal(err, null, 'there was an error getting members of the redis alertreon ID set');
            assert.typeOf(originalIds, 'Array', 'ids was not an array');
            
                db.generateUserId(function(id) {
                    assert.match(id, /[0-9A-Z]{20}/, 'error generating alertreon user id');
                    
                    red.SISMEMBER('alertreon:userIds', id, function(err, isMember) {
                        assert.equal(err, null, 'error checking if unique id was generated');
                        assert.equal(isMember, 0, 'generated id was not unique');
                        done();
                    });
                });
        });
    });
    
    
    it('should associate alertreon id with patreon id', function(done) {
        db.generateUserId(function(id) {
            id = '__' + id; // prefix test identifier to id
            db.storeUserId(id, 'starexorcist', function(err) {
                assert.equal(err, null, 'there was an error associating alertreon user id with patreon user id');
                
                //clean up test k/v
                red.DEL('alertreon:' + id, function(err, deleted) {
                    assert.equal(err, null);
                    assert.equal(deleted, 1);
                    
                    done();
                });
            });
        });
    });


    it('should retrieve the known creator patrons from the database', function(done) {
        db.getCreatorPatrons('starexorcist', function(err, patrons) {
            console.log('got patrons: ', patrons)
            assert.equal(err, null, 'error retrieving creators patrons');
            assert.typeOf(patrons, 'array', 'patron list was not an array');
            done();
        });
    });

});