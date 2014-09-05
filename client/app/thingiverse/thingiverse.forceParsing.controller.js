'use strict';

angular.module('openScadAnalyzerApp')
.controller('ParsingCtrl', function ($scope, $rootScope, $http, socket) {

  ////////////////// batch ///////////////////////////////////////

    $scope.limit = 50;
    $scope.filesize = 10000;
    $scope.targetType = 'parseAllFailedFiles';
    $scope.awesomeThings = [];

	  function init(){
      $scope.awesomeThings.length;
      $scope.batchStatus = {
          max: 0, 
          value: 0,
          parsingMsg : ''
      };
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('forceParsing');
    });

    $scope.parseThem = function(){

        init();
        ///reparse/:mode/:limite/:filesize
        $http.get('/api/thingiverses/reparse/'+$scope.targetType+'/'+$scope.limit+'/'+$scope.filesize).success(function(targetFiles) {
           $scope.batchStatus = {max:targetFiles.length, value:0};

           $scope.awesomeThings.length = 0;

           while(targetFiles.length > 0){
              var target = targetFiles.pop();
              var obj = {thing_id:target._thing.id, file_id:target.id,  file_name:target.name,  file_size:target.size, parsingMsg:''};
              $scope.awesomeThings.push(obj);
           }
           socket.syncUpdates('forceParsing', $scope.batchStatus, $scope.awesomeThings);
    
       });
    };

});
