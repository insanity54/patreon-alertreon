// var foo = require('backbone');
// var bar = require('../lib/bar.js');
// var gamma = require('gamma');
 
// var elem = document.getElementById('result');
// var x = foo(100) + bar('baz');
// elem.textContent = gamma(x);


var Backbone = require('backbone');

var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        '/fart': 'fart'
    }
});

var router = new Router();

router.on('route:home', function() {
    console.log('we have loaded the home page');
});

router.on('route:fart', function() {
    console.log("BIG OLD STINKY");
});

    
Backbone.history.start();
