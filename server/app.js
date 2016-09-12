
var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		config = require('./../config'),
		tasks = require('./controllers/tasks'),
		handlingError = require('./middlewares/handlingError'),
		expressValidator = require('express-validator'),
		validations = require('./helpers/validations'),
		bodyParser = require('body-parser'),
		port = config.port;

//bodyParser
app.use(bodyParser.json());
//templates
app.use(express.static(__dirname + '../../dist'));
//validate
app.use(expressValidator(validations));
//controller
app.use('/task', tasks);
//not found
app.get('*', function(req, res, next) {
  var err = new Error();
  err.status = 404;
  next(err);
});
//handlingError
app.use(handlingError.parseError);
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
