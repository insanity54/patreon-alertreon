/* global Backbone */
/* global Marionette */

// Load the application once the DOM is ready, using `jQuery.ready`:


$(function() {



  // new ARouter();

  // App object
  var App = Marionette.Application.extend({
    initialize: function(options) {
      //options.router.on
      //options.router.listenTo(options.router, 'route:alertpage', this.showAlertpage);
      //options.router.listenTo(options.router, 'route:index', this.showIndex);
    }
  });


  var Patreon = Backbone.Model.extend({
    defaults: function() {
      return {
        name: "pumplamoose",
        status: "idle",
        //order: Todos.nextOrder()
      };
    },
    urlRoot: 'puser',
    noIoBind: false
  });


  var Patreons = Backbone.Collection.extend({
    url: 'pusers',
    initialize: function() {
      if (!this.noIoBind) {
        this.ioBind('create', this.serverChange, this);
      }
    },
    serverChange: function(data) {
      console.log('server change collection');
      //console.log(this.models);
      // Useful to prevent loops when dealing with client-side updates (ie: forms).
      data.fromServer = true;
      this.set(data);
    },
    onAddChild: function() {
      console.log('added model to patreons collection');
    }
  });


  // main
  var Controller = Backbone.Marionette.Object.extend({
    initialize: function() {
      this.patreonList = new Patreons();
    },

    start: function() {
      console.log('main controller started');
      //this.showHeader(this.patreonList);
      //this.showFooter(this.todoList);
      //this.showTodoList(this.todoList);
      //this.todoList.on('all', this.showFooter, this);
      //this.listenTo(this.patreonList, 'all', this.showFooter);
      this.listenTo(this.patreonList, 'all', this.addOne);
      this.patreonList.fetch();
    },

    index: function() {
      console.log('THE ROUTE: index');

      this.rootView = new RootView({
        id: 'app'
      });
      this.rootView.render();
      $('body').append(this.rootView.el);

      this.inputView = new InputView();
      this.rootView.getRegion('inputRegion').show(this.inputView);
    },

    alertPage: function(args, two) {
      console.log('THE ROUTE: alertPage', args);
    }
  });


  var PatreonItem = Marionette.ItemView.extend({
    template: '#item-template'
  });


  var PatreonList = Marionette.CollectionView.extend({
    childView: PatreonItem,
    initialize: function() {
      this.listenTo(Patreons, 'add', this.addOne);
    },
    addOne: function(todo) {
      console.log('addOne! todo- ', todo);
      var view = new PatreonItem({
        model: todo
      });
      this.$("#todo-list").append(view.render().el);
      this.input.hide();
    }
  });


  var InputView = Marionette.ItemView.extend({
    ui: {
      input: '#new-todo'
    },
    template: '#input-template',
    events: {
      'keypress @ui.input': 'onInputKeypress'
    },

    onInputKeypress: function(e) {
      var enter_key = 13;

      if (e.keyCode !== enter_key) return;
      if (this.ui.input.val() == '') return;

      console.log('creating ', this.ui.input.val());

      var attrs = {
        noIoBind: true,
        name: this.ui.input.val()
      };

      var _patreon = new Patreon();
      _patreon.set(attrs);
      _patreon.save();

      this.ui.input.val('');
    }
  });


  // root view of the app
  var RootView = Marionette.LayoutView.extend({
    regions: {
      inputRegion: '#input',
      headerRegion: '#item'
    },
    template: '#layout-template'
  });


  var control = new Controller();
  var app = new App();

  app.on('start', function() {
    console.log('app started');
    Backbone.history.start({
      pushState: true
    });

    //var control = new Controller();
    // control.router = new ARouter({
    //   index: function() {
    //     console.log('fukc index');
    //   },
    //   controller: control
    // });

    control.start();
  });

  var ARouter = Marionette.AppRouter.extend({
    appRoutes: {
      "": "index", // #/
      "alerts/:alert": "alertPage" // #alerts/BH5G8IA1JE96LL4FLH2D
    },
    controller: control
  });
  
  new ARouter();

  app.start();


});