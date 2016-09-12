
'use strict';
/**
 * Load states for application (UI-Router)
 */
angular.module('fullstackApp')
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){

    // any unknown URLS go to 404
    $urlRouterProvider.otherwise('/404');
    // no route goes to index
    $urlRouterProvider.when('', '/');
    // use a state provider for routing
    $stateProvider
      .state('app', {
        abstract: true,
        templateUrl: "./views/home/homeView.html",
      })
      .state('app.tasks', {
          url: '/',
          templateUrl: './views/tasks/tasksView.html',
          controller: "TasksCtrl"
      })
      .state('404', {
          url: '/404',
          templateUrl: './views/not_found/404.html'
      })
}]);
