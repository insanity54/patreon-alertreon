var By = require('selenium-webdriver').By;



module.exports = function detectEnd(driver, cb) {

    var elementPromise = driver.findElement(By.css('div#infscr-loading div:nth-child(2)'));
    elementPromise.then(function(element) {
	
    	element.getAttribute("innerHTML").then(function(value) {
    	    console.log("VALUE:", value);
	    
    	    var endDetected;
    	    if (value == 'Loading the next set of posts...') {
    		endDetected = 0;
    	    }
	    
    	    if (value == 'No more items to load.') {
    		endDetected = 1;
    	    }
	    
    	    return cb(null, endDetected);
	    
    	});
	
    }, function(err) {
    	// the element doesn't exist until we scroll down.
    	// since the element is not found, assume not at the end of the list.	
        if (err.name === "NoSuchElementError") {
    	    console.log('element was missing');	    
    	    return cb(null, 0);
    	}
    	else {
    	    return cb(err);
    	}
    });
}
