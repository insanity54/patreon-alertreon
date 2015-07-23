var By = require('selenium-webdriver').By;
var async = require('async');

/**
 * @param cb - (err, {Array} patrons)
 */
module.exports = function getVisiblePatrons(driver, cb) {
    console.log('[getVisiblePatrons]');

    var elementsPromise = driver.findElements(By.css('div.searchShareArea a'));
    elementsPromise.then(function(elements) {


        var patrons = [];

        async.eachSeries(elements, function(el, elCb) {
            //for (var i = 0; i < elements.length; i ++) {
            //elements[i].getAttribute("href").then(function(attribute) {
            el.getAttribute("href").then(function(attribute) {
                //console.log('attr:', attribute);

                // get just the username from the URL
                var patreonUserId;
                var index = attribute.lastIndexOf('?u=');
                // figure out if /?u= or /username
                if (index == -1) {
                    // it's /username or something else
                    // get the username after the '/'
                    patreonUserId = attribute.substr(attribute.lastIndexOf('/') + 1);
                }

                else {
                    // it's /?u=
                    patreonUserId = attribute.substr(index);
                }

                patrons.push(patreonUserId);
                return elCb(null);

            });

        }, function(err) {
            if (err) throw err;
            return cb(null, patrons);
        });
    });
};
