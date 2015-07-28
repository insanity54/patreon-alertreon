
/**
 * gets the patron page using selenium webdriver
 * 
 * @param driver - selenium webdriver object
 * @param cb - {gotPageCallback} cb
 */
module.exports = function getCreatorPage(driver, patreonCreatorUsername, cb) {
    if (typeof driver === 'undefined') throw new Error('driver is not defined');
    if (typeof patreonCreatorUsername === 'undefined') throw new Error('did not get patreonCreatorUsername');
    if (typeof cb === 'undefined') throw new Error('did not get callback');

    console.log('[patreon::getCreatorPage] - getting creator ' + patreonCreatorUsername + ' page');
    //driver.get('https://www.patreon.com/' + patreonCreatorUsername + '?ty=p', function() {
    driver.get('http://www.google.com').then(function() {
    
        console.log('[patreon::getCreatorPage] - got creator page: ' + page);
	return cb(null);
    });


};
/**
 * @callback {gotPageCallback}
 * @param {Error} err
 */
