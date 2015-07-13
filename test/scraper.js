var expect = require('chai').expect;
var path = require('path');
//var main = require(path.join('..', 'lib', 'main'));
var app = require(path.join('..', 'index'));
//var data = require(path.join('..', 'lib', 'data'));
var cheerio = require('cheerio');
var request = require('request');
var scraper = require('../scraper/scraper');


describe('Scraper', function() {

    this.timeout(20000);


    it('should get a list of patrons', function(done) {
        
        scraper.check('pomplamoose', function(err, users) {
            if (err) throw err;
            console.log('users', users);
            //console.log('--');
            //console.log('users2', users.two);
            done();
        });
        
        
        // request('https://www.patreon.com/pomplamoose', function(err, res, bod) {
        //   if (!error && response.statusCode == 200) {
        //     console.log(body) // Show the HTML
        //   }
        //})
    });
});