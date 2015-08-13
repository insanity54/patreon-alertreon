// ----------------
// DEPS
// ----------------

require('./plugins');
var Backbone = require('backbone');
var inputTpl = require('./input-template.nunj');
var statusTpl = require('./input-status.nunj');
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


var Status = Backbone.View.extend({
    el: '#status',
    template: statusTpl,
    initialize: function(model) {
        this.model = model;
        this.render();
    },
    render: function() {
        console.log('rendering status');
        this.$el.html(this.template.render());
        return this;
    }
});


var Input = Backbone.View.extend({
    el: '#nameInput',
    template: inputTpl,
    
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
        this.$el.html(this.template.render({username: this.model.get("name")}));
        return this;
    },
    
    initialize: function(model) {
        this.model = model;
    }
});



var router = new Router();
var creator = new Creator();
var input = new Input(creator);
var status = new Status(creator);



router.on('route:home', function() {
    input.render();
});



router.on('route:fart', function() {
    console.log("BIG OLD STINKY");
});

    
Backbone.history.start();