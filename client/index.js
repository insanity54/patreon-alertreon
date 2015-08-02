// var foo = require('backbone');
// var bar = require('../lib/bar.js');
// var gamma = require('gamma');
 
// var elem = document.getElementById('result');
// var x = foo(100) + bar('baz');
// elem.textContent = gamma(x);


// ----------------
// DEPS
// ----------------
var Backbone = require('backbone');
$ = jQuery = require('jquery');
var _ = require('lodash');
var bootstrap = require('bootstrap');



// ----------------
// OTHER PARTS OF APP
// ----------------
var Input = require('./input/input.js');
var App = require('./application/application.js');



// ----------------
// INDEX
// ----------------

var app = new App();



var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        '#fart': 'fart'
    }
});






// --------------------------
// VIEWS
// --------------------------

// var input = new Input({
//   container: 
// });



var List = Backbone.View.extend({
    el: '.page',
    render: function() {
      this.$el.html('BIG OL STINKY');  
    }
});



var router = new Router();
var list = new List();


router.on('route:home', function() {
    list.render();
});



router.on('route:fart', function() {
    console.log("BIG OLD STINKY");
});

    
Backbone.history.start();
