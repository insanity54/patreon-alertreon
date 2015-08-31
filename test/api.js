var assert = require('chai').assert;
var path = require('path');
var app = require(path.join('..', 'lib', 'server'));
var request = require('supertest');

//var app = require(path.join('..', 'index')).app;
//var server = require(path.join('..', 'index')).server;



describe('API', function() {

    this.timeout(20000);

    it('should accept a /user PUT', function(done) {
        request(app)
            .put('/user')
            .send({"name":"josi"})
            .expect('Content-Type', /json/)
            .expect(200, done)
            .end(function(err, res) {
                if (err) throw err;
            });
    });


});