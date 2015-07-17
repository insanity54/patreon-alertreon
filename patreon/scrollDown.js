/**
 * @param cb - (err)
 */
module.exports = function scrollDown(driver, cb) {
    driver.executeScript("window.scrollBy(0,100000);").then(function() {
	return cb(null);
    });
}
