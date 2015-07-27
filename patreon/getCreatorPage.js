
/**
 * gets the patron page using selenium webdriver
 * 
 * @param driver - selenium webdriver object
 * @param cb - {gotPageCallback} cb
 */
module.exports = function getCreatorPage(driver, patreonCreatorUsername, cb) {
    console.log('getting', patreonCreatorUsername);
    driver.get('https://www.patreon.com/' + patreonCreatorUsername + '?ty=p').then(function() {
        return cb(null);
    });
};
/**
 * @callback {gotPageCallback}
 * @param {Error} err
 */
