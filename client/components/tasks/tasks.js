'use strict';

angular.module('app.tasks', [])
	.controller("TasksCtrl", ['$scope', 'taskService', 'lodash', function ($scope, taskService, _) {

		$scope.tasks = [];
		$scope.create = true;
		$scope.sortBy = {
			name: false,
			due_date: false,
			priority: false
		};
		//get data
		taskService.get().then(function(res){
			if(res.data){
				$scope.tasks = res.data;
			}
		}, function(err){
			$scope.msgError = true;
			$scope.message = 'Error get data';
		});

		$scope.createTask = function(){

			var date = $scope.dueDate ? _.clone($scope.dueDate) : new Date();
			var month = (date.getMonth()+1) >= 10 ? (date.getMonth()+1)  : '0' + (date.getMonth()+1);
			var day =  date.getDate() >= 10 ? date.getDate() : '0'+ date.getDate();

			var dateFormat = date.getFullYear()  + '-' + month + '-' + day;

			//create task
			taskService.create($scope.name, $scope.priority, dateFormat).then(function(res){
				if(res.data){
					$scope.tasks.push(res.data);
					$scope.msgSuccess = true;
					$scope.message = 'Created';
				}
			}, function(err){
				$scope.msgError = true;
				$scope.message = 'Error creating the task';
			});
		};

		$scope.update = function(data){
			//update fields
			$scope.name = data.name;
			$scope.priority = data.priority;
			$scope.dueDate = data.due_date;
			$scope.idTask = data._id;
			$scope.create = false;
		};

		$scope.updateTask = function(){
			//data
			var data = {
				name: $scope.name,
				priority: $scope.priority,
				dueDate: $scope.dueDate,
			};
			//update task
			taskService.update($scope.idTask, data).then(function(res){
				if(res.data){
					_.forEach($scope.tasks, function(data, key){
						if(data._id === $scope.idTask)
							$scope.tasks[key] = res.data;
					});
					$scope.msgSuccess = true;
					$scope.message = 'Updated';
				}
			}, function(err){
				$scope.msgError = true;
				$scope.message = 'Error updating the task';
			});
		};

		$scope.deleteTask = function(id){
			//delete task
			taskService.delete(id).then(function(res){
				if(res.data){
					$scope.message = 'Deleted';
					_.remove($scope.tasks, function(value) {
						return value._id === id
					});
					$scope.msgSuccess = true;
					$scope.reset();
				}
			}, function(err){
				$scope.msgError = true;
				$scope.message = 'Error deleting the task';
			});
		};

		$scope.reset = function(){
			$scope.name =
			$scope.priority =
			$scope.dueDate = undefined;
			$scope.create = true;
		}

		$scope.sort = function(field){
			var sort = 'desc';
			if(!$scope.sortBy[field]){
				sort = 'asc';
				$scope.sortBy[field] = true;
			}
			else{
				$scope.sortBy[field] = false;
			}
			$scope.tasks = _.orderBy($scope.tasks, [field], [sort]);
		}
}]);
