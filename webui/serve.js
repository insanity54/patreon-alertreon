var express = require('express');
var path = require('path');


module.exports = function serve(app) {
    app.use(express.static(path.join(__dirname, '..', 'public')));
    
    app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });

}