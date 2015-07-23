var expect = require('chai').expect;
var assert = require('chai').assert;
var path = require('path');
//var main = require(path.join('..', 'lib', 'main'));
var app = require(path.join('..', 'index'));
//var data = require(path.join('..', 'lib', 'data'));
var cheerio = require('cheerio');
var request = require('request');
//var patreon = require('../patreon/patreon');


describe('Patreon', function() {

    var driver;
    var patreon = require('../patreon/index');
    var webdriver = require('selenium-webdriver');
    var FirefoxProfile = require('firefox-profile');
    var fp = new FirefoxProfile();
    
    
    
    this.timeout(1000 * 60 * 1); // 1 minute


    beforeEach(function(done) {
        var capabilities = webdriver.Capabilities.firefox();
        fp.encoded(function(encodedProfile) {
            capabilities.set('firefox_profile', encodedProfile);

            driver = new webdriver.Builder()
                .forBrowser('firefox')
                .withCapabilities(capabilities)
                .build();
                
            done();
        });
    });


    it('should get the official patron count for a creator', function(done) {
        assert.notEqual(driver, undefined, 'driver is undefined!');
        
        console.log('getting page');
        patreon.getCreatorPage(driver, 'starexorcist', function(err) {
            assert.equal(err, null, 'there was an error getting the creator page');
            
            console.log('get count');
            patreon.getPatronCount(driver, 'starexorcist', function(err, patronCount) {
                assert.equal(err, null, 'ther was an error with patreon.getPatronCount');
                assert.typeOf(patronCount, 'number', 'patronCount is not a number');
                done();
            });
        });
    });




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