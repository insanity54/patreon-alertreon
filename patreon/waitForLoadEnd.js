var By = require('selenium-webdriver').By;


module.exports = function waitForLoadEnd(driver, cb) {
    var elementPromise = driver.findElement(By.css('div#infscr-loading'));
	elementPromise.then(function(element) {

	    element.getCssValue("display").then(function(displayValue) {

		if (displayValue == 'none') {
		    // loading div is hidden. continue on because we're done loading
		    return cb(null);
		}
		
		else {
		    // loading div is visible. we're still loading, so just wait.
		    setTimeout(function() {
			waitForLoadEnd(driver, function(err, callback) {
			    if (err) throw err;
			    return cb(null);
			})
		    }, 200); // @todo this could cause problems if the page gets stuck loading. It needs an eventual timeout
		}
	    });
	});
}
