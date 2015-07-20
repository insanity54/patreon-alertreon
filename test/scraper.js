var expect = require('chai').expect;
var path = require('path');
//var main = require(path.join('..', 'lib', 'main'));
var app = require(path.join('..', 'index'));
//var data = require(path.join('..', 'lib', 'data'));
var cheerio = require('cheerio');
var request = require('request');
//var patreon = require('../patreon/patreon');


describe('Patreon', function() {

    //this.timeout(1000 * 60 * 20);

    
    

    // it('should get a list of patrons', function(done) {
        
    // 	var patreon = require('../patreon/index');

    // 	patreon.

    // 	// patreon.getCreatorPatrons('josi', function(err, users) {
    // 	//     expect(err).to.be.null;
    // 	//     expect(users).to.be.an('array');
    // 	//     expect(users.length).to.be.greaterThan(1);
    // 	//     if (err) throw err;
    // 	//     console.log(users);
    // 	// });

	
        
    //     // request('https://www.patreon.com/pomplamoose', function(err, res, bod) {
    //     //   if (!error && response.statusCode == 200) {
    //     //     console.log(body) // Show the HTML
    //     //   }
    //     //})
    // });
});