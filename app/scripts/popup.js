import angular from 'angular';

var app = angular.module('app', []);
app.controller('PopupCtrl', $scope => {
  $scope.foo = 'bar';
});