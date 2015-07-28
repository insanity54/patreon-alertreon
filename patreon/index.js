var webdriver = require('selenium-webdriver');
var FirefoxProfile = require('firefox-profile');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;
var async = require('async');
var storage = require('../database/datastore');
var Readable = require('stream').Readable;
var util = require('util');
var eventEmitter = require('events').EventEmitter;


// other parts
var detectEnd = require('./detectEnd');
var scrollDown = require('./scrollDown');
var getVisiblePatrons = require('./getVisiblePatrons');
var waitForLoadStart = require('./waitForLoadStart');
var waitForLoadEnd = require('./waitForLoadEnd');
var getPatronCount = require('./getPatronCount');
var getCreatorPage = require('./getCreatorPage');


var fp = new FirefoxProfile();
// disable css, images, and flash
//fp.setPreference('permissions.default.stylesheet', 2);
fp.setPreference('permissions.default.image', 0);
fp.setPreference('dom.ipc.plugins.enabled.libflashplayer.so', 'false');



//creator.on('gotPatrons')

//var creator = patreon.getCreatorPatrons('josi');

    


/**
 * getCreatorPatronCount
 *
 * crawls the page and fetches the creator's listed patron count
 *
 * @param {String} patreonCreatorUsername
 * @param {onGotCountCallback} cb
 */
var getCreatorPatronCount = function getCreatorPatronCount(patreonCreatorUsername, cb) {
    
    var capabilities = webdriver.Capabilities.firefox();
    fp.encoded(function(encodedProfile) {
	capabilities.set('firefox_profile', encodedProfile);
	
	var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .withCapabilities(capabilities)
            .build();
	
	
	driver.get('https://www.patreon.com/' + patreonCreatorUsername + '?ty=p');
	
	getPatronCount(driver, patreonCreatorUsername, function(err, count) {
	    if (err) return cb(err);
	    return cb(null, count);
	});
    });
}
/**
 * @callback {onGotCountCallback}
 * @param {Error} err
 * @param {integer} count
 */







var getCreatorPatrons = function getCreatorPatrons(patreonCreatorUsername, cb) {


    var capabilities = webdriver.Capabilities.firefox();
    fp.encoded(function(encodedProfile) {
	capabilities.set('firefox_profile', encodedProfile);
	
	var driver = new webdriver.Builder()
            .forBrowser('firefox')
            .withCapabilities(capabilities)
            .build();


        //console.log('scraping https://www.patreon.com/' + patreonCreatorUsername + '?ty=p');

        driver.get('https://www.patreon.com/' + patreonCreatorUsername + '?ty=p');
        //driver.get('https://www.patreon.com/schroedingham?ty=p');

        var patrons = [];

        function processPatrons() {
            var index = 1;

            detectEnd(driver, function(err, ended) {
                if (err) throw err;
                if (ended) {
                    // the end of the patron list. scrape, return

                    getVisiblePatrons(driver, function(err, patrons) {
                        if (err) throw err;
                        //console.log('got more patrons:', patrons);
                        console.log('[index] total patrons found:', patrons.length);

                        
                        return cb(null, patrons);
                    });
                }
                else {
                    // not the end. scroll down, wait, repeat
                    scrollDown(driver, function(err) {
                        if (err) throw err;
                        console.log('[index] scroll down complete');

                        waitForLoadStart(driver, function(err) {
                            if (err) throw err;
                            console.log('[index] wait for load (start) complete.');

                            waitForLoadEnd(driver, function(err) {
                                if (err) throw err;
                                console.log('[index] wait for load (end) complete.');

                                index++;
                                console.log('completed', index, 'loop iteration');

                                return processPatrons(index);
                            });
                        });
                    });
                }
            });
        }



        processPatrons();

    });
};







module.exports = {
    getCreatorPatrons: getCreatorPatrons,
    getCreatorPatronCount: getCreatorPatronCount,    
    getPatronCount: getPatronCount,
    getCreatorPage: getCreatorPage,
    detectEnd: detectEnd
};