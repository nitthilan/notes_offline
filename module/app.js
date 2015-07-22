
window.routes =
{
  "/notes": {
    templateUrl: 'module/notes/notes_view.html',
    controller: 'notesCtrl',
    requireLogin: true
  }
};
// Declare app level module which depends on filters, and services
var MyApp = angular.module('myApp', ['myApp.controllers', 'ngRoute', 'ui.bootstrap', 'ui.ace']);
var MyAppControllers = angular.module('myApp.controllers', []);

MyApp
.config(['$routeProvider', function($routeProvider) {
  for(var path in window.routes){
    $routeProvider.when(path, window.routes[path]);
  }
  $routeProvider.otherwise({redirectTo: '/notes'});
}]);
