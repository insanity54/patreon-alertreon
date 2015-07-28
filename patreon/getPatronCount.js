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

	console.log('got css selector');

	return cb(null, 5);

        // var patronCount;
        // element.getAttribute("innerHTML").then(function(attribute) {
        //     // get just the username from the URL
        //     patronCount = attribute || 0;
        //     return cb(null, patronCount);
        // });
    });
};
/**
 * @Callback {patronCountCallback}
 * @param {Error} err
 * @param {int} patronCount
 */