(function () {

  'use strict';

  require('angular');
  require('angular-route');
  var Firebase = require('firebase');

  var selectChapterController = require('./controllers/selectChapterController');
  var annotationController = require('./controllers/annotationController');
  var directive = require('./directive/directive');

  angular.module("app", ["ngRoute"])
  .config(function ($routeProvider) {
    $routeProvider.when("/", {
      controller: 'selectChapterController',
      controllerAs: "vm",
      templateUrl: "./../views/selectChapterView.html"
    });
    $routeProvider.when("/edit/:chapter", {
      controller: 'annotationController',
      controllerAs: "vm",
      templateUrl: "./../views/editChapterView.html"
    });
    $routeProvider.otherwise({ redirectTo: "/" });
  })

  .controller('selectChapterController',selectChapterController)
  .controller('annotationController', annotationController)
  .directive("directive", directive);

  annotationController.$inject = ['$routeParams', '$http', '$sce', '$scope'];
  selectChapterController.$inject = ['$http'];
  directive.$inject = ['$compile'];

})();