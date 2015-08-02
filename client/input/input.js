var template = require('./input-template.html');
var Backbone = require('backbone');
var nunjucks = require('nunjucks');
// $ = jQuery = require('jquery');
// var _ = require('lodash');

module.exports = Backbone.View.extend({
    el: '.application__content',
    render: function() {
        console.log('rendering input template');
        var tpl = nunjucks.render(template);
        this.$el.html(tpl);
    }
});

