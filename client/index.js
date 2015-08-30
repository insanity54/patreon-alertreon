// ----------------
// DEPS
// ----------------

// require('./plugins');
// var Backbone = require('backbone');
// //var inputTpl = require('./input-template.nunj');
// //var statusTpl = require('./input-status.nunj');
// //require('./client');
// var io = require('socket.io-client');
// var _ = require('underscore');

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


// Our basic **Creator** model has `name` attribute.
var Creator = Backbone.Model.extend({
    // Default attributes for the todo item.
    defaults: function() {
      return {
        name: "josibee"
      };
    },
    url: '/patreon'
});


var Creators = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Creator,
    url: '/patreon'
});


// Create our global collection of **Todos**.
var creators = new Creators;


// creator Item View
// --------------

// The DOM element for a todo item...
var CreatorView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",
    
    // Cache the template function for a single item
    //template: _.template($('#item-template').html()),
    //template: statusTpl,
    
    // The DOM events specific to an item.
    events: {
      "click #submitter"   : "createCreator"
    },
    
    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        console.log('template is ', window.jQuery('#item-template').html())
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },
    
    // Re-render the titles of the todo item.
    render: function() {
      //window.jQueryel.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.input = window.jQuery('.edit');
      return this;
    },
    
    // Toggle the `"done"` state of the model.
    toggleDone: function() {
      this.model.toggle();
    },
    
    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
      this.$el.addClass("editing");
      this.input.focus();
    },
    
    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
      var value = this.input.val();
      if (!value) {
        this.clear();
      } else {
        this.model.save({title: value});
        this.$el.removeClass("editing");
      }
    },
    
    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function(e) {
      if (e.keyCode == 13) this.close();
    },
    
    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

});



// Our overall **AppView** is the top-level piece of UI.
var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: window.jQuery("#nameIput"),
    
    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: 'fart',//_.template($('#stats-template').html()),
    
    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
      "click #clear-completed": "clearCompleted",
      "click #toggle-all": "toggleAllComplete"
    },
    
    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
    
        console.log('appview init');
        console.log('blah', window.jQuery("#stats-template").html())
      this.input = window.jQuery("#patreon-username");
      this.allCheckbox = window.jQuery("#toggle-all")[0];
    
      this.listenTo(Creators, 'add', this.addOne);
      this.listenTo(Creators, 'reset', this.addAll);
      this.listenTo(Creators, 'all', this.render);
    
      this.footer = window.jQuery('footer');
      this.main = window.jQuery('#main');
    
      creators.fetch();
    },
    
    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Creators.done().length;
      var remaining = Creators.remaining().length;
    
      if (Creators.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }
    
      this.allCheckbox.checked = !remaining;
    },
    
    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(creator) {
      var view = new CreatorView({model: creator});
      window.jQuery("#creator-list").append(view.render().el);
    },
    
    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Creators.each(this.addOne, this);
    },
    
    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
    
      Creators.create({title: this.input.val()});
      this.input.val('');
    },
    
    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(Creators.done(), 'destroy');
      return false;
    },
    
    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Creators.each(function (creator) { creator.save({'done': done}); });
    }

});

// Finally, we kick things off by creating the **App**.
var App = new AppView;
