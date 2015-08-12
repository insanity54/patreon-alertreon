var Backbone = require('backbone'); // import Backbone from 'backbone';
Backbone.$ = require('jquery');          //import $ from 'jquery';
var Marionette = require("backbone.marionette");  // import Marionette from 'backbone.marionette';
require('bootstrap');                 //import 'bootstrap';
require('backbone-query-parameters'); //import 'backbone-query-parameters';
require('backbone.iobind');
require('./sync');



// start the marionette inspector
if (window.__agent) {
  window.__agent.start(Backbone, Marionette);
}