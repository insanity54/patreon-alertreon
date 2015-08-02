var By = require('selenium-webdriver').By;




/**
 * gets the official patron count which is visible on the patron page.
 * 
 * @param driver - selenium webdriver object
 * @param {String} patreonCreatorUsername
 * @param {patronCountCallback} cb
 */
module.exports = function getPatronCount(driver, patreonCreatorUsername, cb) {
    //console.dir(driver);
    //return cb(null, 6);
    
    var elementPromise = driver.findElement(By.css('#categoryMenu > li:nth-child(4) > a:nth-child(1) > strong:nth-child(1)'))
	.then(function(element) {
	    //elementPromise.then(function(element) {

	    console.log('[patreon::getPatronCount] got css selector');

            var patronCount;
            element.getAttribute("innerHTML").then(function(attribute) {
                // get the patron count from the #categoryMenu heading
		if (typeof attribute === 'undefined') return cb(new Error('could not get inner html of #categoryMenu patron heading'));
                patronCount = parseInt(attribute);
                return cb(null, patronCount);
            });
	});
};
/**
 * @Callback {patronCountCallback}
 * @param {Error} err
 * @param {int} patronCount
 */