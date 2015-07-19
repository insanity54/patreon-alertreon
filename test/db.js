var expect = require('chai').expect;
var path = require('path');






describe('Database', function() {

    var db;
    var redis;
    var red;


    before(function() {
        db = require('../database/datastore');
        redis = require('redis');
        red = redis.createClient();
    });
    
    
    beforeEach(function(done) {
        red.DEL('patreon:__alertreontest:patronsAllTime', function(err) {
            expect(err).to.equal(null);
            
            red.DEL('patreon:__alertreontest:patronsCurrent', function(err) {
                expect(err).to.equal(null);
                done();
            });
        });        
    });
    
    it('tests should start with clean slate', function(done) {
        red.EXISTS('patreon:__alertreontest:patronsAllTime', function(err, reply) {
            expect(reply).to.equal(0);
            
            red.EXISTS('patreon:__alertreontest:patronsCurrent', function(err, reply) {
                expect(reply).to.equal(0);
            });
        });
    });

    it('should add a new patron to the database if they\'re new', function(done) {
        db.logCreatorPatron('__alertreontest', 'newnancy', function(err, response) {
            expect(err).to.equal(null);
            expect(response.status).to.equal(0);

            red.SISMEMBER('patreon:__alertreontest:patronsAllTime', 'newnancy', function(err, isMember) {
                expect(err).to.equal(null);
                expect(isMember).to.equal(1);
                done();
            });
        });
    });
    
    
    it('should detect a new patron', function(done) {
        db.logCreatorPatron('__alertreontest', 'newnancy', function(err, response) {
            expect(err).to.equal(null);
            expect(response.type).to.equal('new');
            
            
        });
    });
    
    
    it('should detect a returning patron', function(done) {
        db.logCreatorPatron('__alertreontest', 'rogerresub', function(err, response) {
            expect(err).to.equal(null);
            expect(response.type).to.equal('renew');
            done();
        });
    });
});