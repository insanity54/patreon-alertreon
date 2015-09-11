// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone.localStorage.html)
// to persist Backbone models within your browser.


// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Todo** model has `title`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

    urlRoot: 'puser',
    noIoBind: false,
    
    // Default attributes for the todo item.
    defaults: function() {
      return {
        name: "pumplamoose",
        status: "idle",
        //order: Todos.nextOrder()
      };
    },
    
    // initialize: function() {
    //   if (!this.noIoBind) {
    //     this.ioBind('create', this.serverChange, this);
    //   }
    // },
    
    // serverChange: function (data) {
    //   console.log('server change model');
    //   // Useful to prevent loops when dealing with client-side updates (ie: forms).
    //   data.fromServer = true;
    //   this.set(data);
    // }
  });


  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

    url: 'pusers',

    // Reference to this collection's model.
    model: Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    //localStorage: new Backbone.LocalStorage("todos-backbone"),
    
    initialize: function() {
      if (!this.noIoBind) {
        this.ioBind('create', this.serverChange, this);
      }
    },
    
    serverChange: function (data) {
      console.log('server change collection');
      //console.log(this.models);
      // Useful to prevent loops when dealing with client-side updates (ie: forms).
      data.fromServer = true;
      this.set(data);
    },
    // Filter down the list of all todo items that are finished.
    // done: function() {
    //   return this.where({done: true});
    // },

    // Filter down the list to only todo items that are still not finished.
    // remaining: function() {
    //   return this.where({done: false});
    // },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: 'order'

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#item-template').html()),

    // The DOM events specific to an item.
    events: {
      "click a.destroy" : "clear",
    //  "keypress .edit"  : "updateOnEnter",
    //  "blur .edit"      : "close"
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      //this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
    },

    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      //this.$el.toggleClass('done', this.model.get('done'));
      this.input = this.$('.edit');
      return this;
    },

    // // Switch this view into `"editing"` mode, displaying the input field.
    // edit: function() {
    //   this.$el.addClass("editing");
    //   this.input.focus();
    // },

    // Close the `"editing"` mode, saving changes to the todo.
    // close: function() {
    //   var value = this.input.val();
    //   if (!value) {
    //     this.clear();
    //   } else {
    //     this.model.save({name: value});
    //     this.$el.removeClass("editing");
    //   }
    // },

    // If you hit `enter`, we're through editing the item.
    // updateOnEnter: function(e) {
    //   if (e.keyCode == 13) this.close();
    // },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });
  
  
  
  

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#todoapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "keypress #new-todo":  "createOnEnter",
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-todo");

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'remove', this.deleteOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);
      this.listenTo(Todos, 'add', this.updateStats);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
    },
    
    updateStats: function(model) {
      //console.log('udpate stats')
      var status = model.get("status");
      var id = model.get("id");
      var name = model.get("name");
      
      this.footer.html(this.statsTemplate({id: id, status: status, name: name}));
    },
    

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      
      //console.log('RENDERING. ');
      //var done = Todos.done().length;
      //var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        //this.footer.html(this.statsTemplate({id: id, status: status}));
      } else {
        this.main.hide();
        this.footer.hide();
      }
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      console.log('addOne! todo- ', todo);
      var view = new TodoView({model: todo});
      this.$("#todo-list").append(view.render().el);
      this.input.hide();
    },
    
    deleteOne: function(todo) {
      this.input.show();
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      console.log('addAll ');
      Todos.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;
      
      console.log('creating ', this.input.val());
      var attrs = {
        noIoBind: true,
        name: this.input.val()
      };
      
      var _todo = new Todo();
      _todo.set(attrs);
      console.log(_todo.attributes);
      _todo.save();
      this.input.val('');
      
      
      
    },

    // Clear all done todo items, destroying their models.
    // clearCompleted: function() {
    //   _.invoke(Todos.done(), 'destroy');
    //   return false;
    // },

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
