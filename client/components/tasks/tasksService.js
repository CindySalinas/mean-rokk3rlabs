'use strict';

angular.module('app.tasks').service('taskService', ['$http', function($http) {
	var url = 'http://localhost:7000/';
	//get task
	this.get = function(){
		return $http.get(url+'task');
	};
	//create task
	this.create = function(name, priority, dueDate){
		var data = 'task/create?name=' + name + '&priority=' + priority + '&dueDate=' + dueDate;
		return $http.post(url+data);
	};
	//delete task
	this.delete = function(id){
		return $http.get(url+'task/destroy/' + id);
	};
	//update task
	this.update = function(id, data){
		return $http.post(url+'task/update/'+id, data);
	};
}]);
