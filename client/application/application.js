var $ = require('jquery');
//var _ = require('lodash');
//var radio = require('backbone.radio');
//var nprogress = require('nprogress');
//var Backbone = require('backbone');
//Backbone.$ = $;
var Marionette = require('backbone.marionette');
var LayoutView = require('./layout-view');

// var routerChannel = radio.channel('router');

// nprogress.configure({
//   showSpinner: false
// });

module.exports = Marionette.Application.extend({
  initialize: function(options) {
    
    this.mergeOptions(options, ['container']);
    console.log('The option is:', this.container);
    
    //this.$body = $(document.body);
    this.layout = new LayoutView();
    console.log('render that a');
    this.layout.render();

    // this.listenTo(routerChannel, {
    //   'before:enter:route' : this.onBeforeEnterRoute,
    //   'enter:route'        : this.onEnterRoute,
    //   'error:route'        : this.onErrorRoute
    // });
  }
  
  

//   onBeforeEnterRoute() {
//     console.log('onBeforeEnterRoute');
//     this.transitioning = true;
//     // Don't show for synchronous route changes
//     _.defer(function() {
//       if (this.transitioning) {
//         nprogress.start();
//       }
//     });
//   },

//   onEnterRoute() {
//     console.log('onEnterRoute');
//     this.transitioning = false;
//     this.$body.scrollTop(0);
//     nprogress.done();
//   },

//   onErrorRoute() {
//     console.log('onErrorRoute');
//     this.transitioning = false;
//     nprogress.done(true);
//   }
});


