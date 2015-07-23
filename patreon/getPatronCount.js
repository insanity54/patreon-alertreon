var By = require('selenium-webdriver').By;




/**
 * gets the official patron count which is visible on the patron page.
 * 
 * @param driver - selenium webdriver object
 * @param cb - {gotPatronCountCallback} cb
 */
module.exports = function getPatronCount(driver, patreonCreatorUsername, cb) {
    // var elementPromise = driver.findElement(By.css('#categoryMenu > li:nth-child(4) > a:nth-child(1) > strong:nth-child(1)'));
    // elementPromise.then(function(element) {
    
    //     var patronCount;
        
    //     element.getAttribute("innerHTML").then(function(attribute) {
    //         // get just the username from the URL
    //         patronCount = attribute || 0;
    //         return cb(null, patronCount);
    //     });
    // });
    console.log('get cont');
};
/**
 * @callback {patronCountCallback}
 * @param {Error} err
 * @param {int} patronCount
 */