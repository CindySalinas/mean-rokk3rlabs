
'use strict';

angular.module('fullstackApp', [
		'ui.router',
		'app.tasks'
	])
	.service('lodash', ['$window', function($window) {
		return $window._;
	}])
	.service('moment', ['$window', function($window){
		return $window.moment;
	}]);
