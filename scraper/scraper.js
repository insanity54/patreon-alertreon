var webdriver = require('selenium-webdriver');
var By = require('selenium-webdriver').By;
var until = require('selenium-webdriver').until;

//var webdriver = require('webdriver');
var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

// module.exports = {
//     check: function check(user, cb) {

//var call = {};

console.log('checking');
//driver.get('https://www.patreon.com/' + user + '?ty=p');
driver.get('https://www.patreon.com/schroedingham?ty=p');
        

//driver.findElements(By.id('userSearchBox'))
var elementsPromise = driver.findElements(By.css('div.searchShareArea a'));

elementsPromise.then(function(elements) {
    elements[0].getAttribute("href")
	.then(function(attribute) {
	    console.log('attribute is: ' + attribute);
	});
});


//    .then(function(element, test) {
//        console.log('got an element');
//	console.log('length is:', element.length);
//	var attrib = element[0].getAttribute("href");

//	console.log('the attrib is', attrib);
	

	
	//console.dir(element[0]);

	//console.log(element.getAttribute('hidden'));
	
	//console.log(element);
        //return elements.;
        //assert(elements.length).equalTo(1);
        //return cb(null, element.getAttribute('id'));
        //return 'fart';
        
//    });

        // driver.executeScript("window.scrollTo(0,Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight));");

        // driver.wait(until.titleIs('webdriver - Google Search'), 8000);
        // //call.two = driver.findElements(By.id('userSearchBox'))
            


        // //driver.findElement(By.name('btnG')).click();
        // //driver.wait(until.titleIs('webdriver - Google Search'), 1000);
        // //driver.quit();
        // return cb(null, call);
//     }
// };
