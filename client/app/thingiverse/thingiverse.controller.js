
'use strict';

angular.module('openScadAnalyzerApp')
  .controller('ThingiverseCtrl', function ($scope, $http, $stateParams, $window, socket) {
    
      $scope.things = [];
      $scope.totalCount = 0 ;
      $scope.currentPage = 1;
      $scope.maxSize = 20;
      
      $scope.tag = $stateParams.tag;
      $scope.isScadFile = function(filename){
         return filename.indexOf('scad') > 0;
      };
      $scope.notParsed = function(scad){
        var flag = scad.name.indexOf('scad') > 0 && scad.isParsed === -1;
         return scad.name.indexOf('scad') > 0 && scad.isParsed === -1;
      };

      goPage(1, $stateParams.tag);

      function goPage(page, tag){
        var listUrl;
        
        if(tag){
          listUrl = '/api/thingiverses/list/' + tag + '/' + page;
        }else{
          listUrl = '/api/thingiverses/list/' + page;
        }
        console.log('listUrl ' + listUrl);
        $http.get(listUrl).success(function(things) {
          $scope.things = things.results;
          $scope.totalCount = things.totalCount;
        });
      }

      $scope.setPage = function(pageNo){
        $scope.currentPage = pageNo;
      }

      $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage + '/' + $stateParams.tag);
        goPage($scope.currentPage, $stateParams.tag);
      }

      $scope.isParsed = function(file){
          if(file.isParsed == 1) return file.name + " [Parsed]";
          if(file.isParsed == -1) return file.name + " [Not Parsed]";
          else return file.name + " [Parsing Failed]"
      }
      
      $scope.isCollapsed = true;
      $scope.isCollapsed2 = true;

      $scope.getContent = function(content){        
        return content.replace(/[\n\r]/g, '<br>');
      }
      $scope.getContext = function(context){        
        return JSON.stringify(context, null, 4);
      }
      $scope.getConfigurateur = function(params) {
        return JSON.stringify(params, null, 4);
      }
      $scope.viewInNewTab = function(url){
        $window.open(url);
      }

      $scope.getIndex = function(index){
        return (($scope. currentPage - 1)*20) +index+1;
      }
});