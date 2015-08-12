// ----------------
// DEPS
// ----------------

require('./plugins');
var Backbone = require('backbone');
var tpl = require('./input-template.nunj');
//require('./client');
var io = require('socket.io-client');


// ----------------
// RUNNER
// ----------------


window.socket = io.connect('https://patreon-alertreon-insanity54.c9.io');


var Router = Backbone.Router.extend({
    routes: {
        '': 'home',
        '#fart': 'fart'
    }
});





var Creator = Backbone.Model.extend({
    defaults: {
        'name': 'josibee'
    },
    urlRoot: 'patreon/user'
});




var Input = Backbone.View.extend({
    el: '#nameInput',
    template: tpl,
    
    events: {
        "click #submitPatreonUsername": "submit",
        "keypress input[type=text]": "process"
    },
    
    process: function(e) {
        console.log('process');
        if (e.keyCode != 13) return;
        this.submit(e);
        //this.model.set('name', n);
    },
    
    submit: function(e) {
        console.log('submit');
        this.model.save();
        //.this.remove();
    },
    
    render: function() {
        console.log('rendering input');
        this.$el.html(this.template.render({username: this.model.get("name")}));
    },
    
    initialize: function(model) {
        this.model = model;
    }
});



var router = new Router();
var creator = new Creator();
var input = new Input(creator);





router.on('route:home', function() {
    input.render();
});



router.on('route:fart', function() {
    console.log("BIG OLD STINKY");
});

    
Backbone.history.start();