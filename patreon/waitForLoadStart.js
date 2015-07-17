var By = require('selenium-webdriver').By;


module.exports = function waitForLoadStart(driver, cb) {
    var elementPromise = driver.findElement(By.css('div#infscr-loading'));
	elementPromise.then(function(element) {

	    element.getCssValue("display").then(function(displayValue) {

		if (displayValue == 'none') {
		    // loading div is hidden. wait because loading hasn't started yet
		    setTimeout(function() {
			waitForLoadStart(driver, function(err, callback) {
			    if (err) throw err;
			    return cb(null);
			});
		    }, 200); // @todo potential problems???
		}
		
		else {
		    // loading div is visible. assume loading has started
		    return cb(null);
		}
		
	    });
	});
}
