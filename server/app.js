
var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		config = require('./../config'),
		port = config.port;

//database
mongoose.Promise = global.Promise;
mongoose.connect(config.db.url, function(err, res) {
	if(err)
		console.log('Sorry, there is no mongo db server running.');
	else
		console.log('Successfully connected to mongodb');
});
//start server
var server = app.listen(port || 8080, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Running on http://%s:%s ', host, port);
});
