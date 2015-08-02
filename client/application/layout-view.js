var Marionette = require('backbone.marionette');
var template = require('./layout-template.nunj');

module.exports = Marionette.LayoutView.extend({
  el: '.application',
  template: template,

  regions: {
    header: '.application__header',
    flashes: '.application__flashes',
    content: '.application__content',
    overlay: '.application__overlay'
  }
});