'use strict';

angular.module('openScadAnalyzerApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'Customizerble Things',
      'link': '/thingiverse/tag/customizer'
    },{
      'title': 'Download Things',
      'link': '/thingiverse/batch'
    },{
      'title': 'Parse things',
      'link': '/thingiverse/parse'
    }];

    $scope.isCollapsed = true;
    $scope.tag = "";
    $scope.goList = function(tag){
      $location.path('/thingiverse/tag/'+tag);
    }

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
