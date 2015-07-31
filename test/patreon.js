var expect = require('chai').expect;
var assert = require('chai').assert;
var path = require('path');
var app = require(path.join('..', 'index'));
var cheerio = require('cheerio');
var request = require('request');



describe('Patreon', function() {

    var patreon = require('../patreon/index');
    var webdriver = require('selenium-webdriver');
    var FirefoxProfile = require('firefox-profile');
    var fp = new FirefoxProfile();
    
    
    this.timeout(1000 * 60 * 1); // 1 minute


    it('should get a patron user\'s patrons', function(done) {
	patreon.getCreatorPatrons('josi', function(err, patrons) {
	    //console.log('patrons are: ' + patrons);
	    assert.typeOf(patrons, 'array', 'patrons list was not an array');
	    done();
	});
    });


    it('should get the official patron count for a creator', function(done) {
	var creator = 'pomplamoose';
	patreon.getCreatorPatronCount(creator, function(err, count) {
	    assert.equal(err, null, 'error while getting ' + creator + ' patron count');
	    assert.typeOf(count, 'number', 'patron count was not a number');
	    assert.isAbove(count, 1, creator + ' is showing less than 1 patron. This must be an error!');
	    console.log('[test::patreon] From the official count, ' + creator + ' has ' + count + ' patrons');
	    done();
	});
    });


    
});