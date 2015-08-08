// ----------------
// DEPS
// ----------------

require('./plugins');
var Backbone = require('backbone');
var tpl = require('./input-template.nunj');
//require('./client');


// ----------------
// RUNNER
// ----------------



var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        '#fart': 'fart'
    }
});


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