'use strict';

angular.module('app.tasks', [])
	.controller("TasksCtrl", ['$scope', 'taskService', 'lodash', function ($scope, taskService, _) {

		$scope.tasks = [];
		$scope.create = true;
		//get data
		taskService.get().then(function(res){
			if(res.data){
				$scope.tasks = res.data;
			}
		}, function(err){
		});

		$scope.createTask = function(){
			//create task
			taskService.create($scope.name, $scope.priority, $scope.dueDate).then(function(res){
				if(res.data){
					$scope.tasks.push(res.data);
					$scope.message = 'Created';
				}
			}, function(err){
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
					$scope.message = 'Updated';
				}
			}, function(err){
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
					$scope.reset();
				}
			}, function(err){
				$scope.message = 'Error deleting the task';
			});
		};

		$scope.reset = function(){
			$scope.name =
			$scope.priority =
			$scope.dueDate = undefined;
			$scope.create = true;
		}
}]);
