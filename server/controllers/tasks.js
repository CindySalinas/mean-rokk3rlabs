var express = require('express'),
	mongoose = require('mongoose'),
	Task = require('./../models/tasks'),
	_ = require("lodash"),
	moment = require("moment"),
	router = express.Router();

/**
  * /task/create (POST)

  * Create task

  * @params
    * name(string)
    * dueDate(date(YYYY-MM-DD))
    * priority(int(1..5))

   * return Object
*/
router.post('/create', function(req, res) {
	//validate params
	req.checkQuery({
		name: {
			notEmpty: {
				errorMessage: 'Name is required'
			},
			isString: {
				errorMessage: 'Invalid name field'
			}
		},
		dueDate:{
			notEmpty: {
				errorMessage: 'dueDate is required'
			},
			isValidDate: {
				options: ['YYYY-MM-DD'],
				errorMessage: 'Invalid date'
			}
		},
		priority:{
			notEmpty: {
				errorMessage: 'priority is required'
			},
			isInt: {
				options:[{
          min: 1,
          max: 5
        }],
        errorMessage: 'priority field must be between 1 and 5'
			}
		}
	});
	//validate error
	var errors = req.validationErrors();
	//send error
	if(errors)
		return res
			.status(500)
			.send({
				status: 500,
				errors: errors
			});
	var tasks = new Task({
		name: req.query.name,
		due_date: req.query.dueDate,
		priority: req.query.priority,
	});
	tasks.save(function(err, data) {
		if(err)
			return res
				.status(500)
				.send({
					status: 500,
					errors: err
				});
		//success
		data = data.toObject();
		data.overdue = overdue(data.due_date);
		return res.send(data);
	});
});
/**
  * /task (GET)

  * Get task

  * return Array
*/
router.get('/', function(req, res) {
	//search
	Task.find({}, function(err, data){
		if(err)
			return res
				.status(500)
				.send({
					status: 500,
					errors: err
				});
		var now = moment().format('YYYY-MM-DD');
		data = _.map(data, function(value){
			value = value.toObject();
			value.overdue = overdue(value.due_date);
			return value;
		});
		return res.send(data);
	});
});
/**
  * /task/destroy/:id (GET)

  * Delete task

  * @param
    * id(mongoId)

   * return Object
*/
router.get('/destroy/:id', function(req, res) {
	//validate params
	req.checkParams({
		id: {
			notEmpty: {
				errorMessage: 'Id is required'
			},
			isMongoId: {
				errorMessage: 'Invalid id field'
			}
		}
	});
	//validate error
	var errors = req.validationErrors();
	//send error
	if(errors)
		return res
			.status(500)
			.send({
				status: 500,
				errors: errors
			});
	//find and remove
	Task.findOneAndRemove({ _id: req.params.id }, function(err, data) {
		if(err)
			return res
				.status(500)
				.send({
					status: 500,
					errors: err
				});
		if(data)
			return res
				.status(200)
				.send(data);
		else
			return res
				.status(404)
				.send({
					status: 404,
					errors: 'Not exist'
				});
	});
});
/**
  * /task/update/:id (POST)

  * Update task

  * @params
    * id(mongoId)
    * name(string)
    * dueDate(date(YYYY-MM-DD))
    * priority(int(1..5))

   * return Object
*/
router.post('/update/:id', function(req, res) {
	//validate params
	req.checkParams({
		id: {
			notEmpty: {
				errorMessage: 'Id is required'
			},
			isMongoId: {
				errorMessage: 'Invalid id field'
			}
		}
	});
	req.checkBody({
		name: {
			notEmpty: {
				errorMessage: 'Name is required'
			},
			isString: {
				errorMessage: 'Invalid name field'
			}
		},
		dueDate:{
			notEmpty: {
				errorMessage: 'dueDate is required'
			},
			isValidDate: {
				options: ['YYYY-MM-DD'],
				errorMessage: 'Invalid date'
			}
		},
		priority:{
			notEmpty: {
				errorMessage: 'priority is required'
			},
			isInt: {
				options:[{
          min: 1,
          max: 5
        }],
        errorMessage: 'priority field must be between 1 and 5'
			}
		}
	});
	//validate error
	var errors = req.validationErrors();
	//send error
	if(errors)
		return res
			.status(500)
			.send({
				status: 500,
				errors: errors
			});
	//update
	Task.findOneAndUpdate({
		_id: req.params.id
	}, {
		name: req.body.name,
		priority: req.body.priority,
		due_date: req.body.dueDate
	},{
		new: true
	}, function(err, task) {
		if (err){
			return res
				.status(500)
				.send({
					status: 500,
					errors: err
				});
		}
		task = task.toObject();
		task.overdue = overdue(task.due_date);
		return res.status(200).send(task);
	});
});

function overdue(date){
	var now = moment().format('YYYY-MM-DD');
	if(moment(date, 'YYYY-MM-DD').diff(now, 'day') > 0)
		return false;
	else
		return true;
}

module.exports = router;
