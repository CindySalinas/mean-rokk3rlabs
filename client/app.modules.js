
'use strict';

angular.module('fullstackApp', [
		'ui.router',
		'app.tasks'
	])
	.service('lodash', ['$window', function($window) {
		return $window._;
	}]);
