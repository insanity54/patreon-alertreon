var $ = require('jquery');
var _ = require('lodash');
//var radio = require('backbone.radio');
//var nprogress = require('nprogress');
var Marionette = require('backbone.marionette');
var LayoutView = require('./layout-view');

// var routerChannel = radio.channel('router');

// nprogress.configure({
//   showSpinner: false
// });

module.exports = Marionette.Application.extend({
  initialize() {
    this.$body = $(document.body);
    this.layout = new LayoutView();
    console.log('render that app');
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