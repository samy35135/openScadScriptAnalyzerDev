'use strict';

angular.module('openScadAnalyzerApp')
.controller('BatchCtrl', function ($scope, $rootScope, $http, socket) {

  ////////////////// batch ///////////////////////////////////////

    $scope.access_token = '';
    $rootScope.me = {};
    $rootScope.checkedToken = false;
    $scope.tag = "customizer";
    $scope.limite = 100;

    $scope.awesomeThings = [];
    $scope.batchStatus = {};
    $scope.initStatus = {max:0, value:0};
    socket.syncUpdatesProgressBar('batchStatus', $scope.initStatus, $scope.batchStatus, $scope.awesomeThings);
    $scope.checkMe = function(token){
      $http.post('/api/thingiverses/checkme', {token:token})
      .success(function(me) {
          $rootScope.checkedToken = true;
          $rootScope.me = me;
      })
      .error(function(err){
          console.log(err);
      });
    };

	  function init(){
      $scope.initStatus = {max:0, value:0};
      $scope.awesomeThings = [];
      $scope.batchStatus = {
          max: 0, 
          value: 0,
          thing_id : 0,
          tagCnt : 0,
          categoryCnt : 0,
          commentCnt : 0,
          fileCnt : 0,
          msg : '',
          parsingMsg : ''
      };
    }

    $scope.batch = function(tag, limite){      
      init();
  		$http.get('/api/thingiverses/batch/'+tag+ '/'+ limite).success(function(initStatus) {

          $scope.awesomeThings.length = 0;  
          $scope.initStatus = initStatus;
          //socket.syncUpdatesProgressBar('batchStatus', $scope.initStatus, $scope.batchStatus, $scope.awesomeThings);
    
	    });
  	};

    $scope.listAll = function(){
      $http.get('/api/thingiverses/listAll/'+$scope.tag).success(function(awesomeThings) {
          $scope.awesomeThings = awesomeThings;
          socket.syncUpdates('thing', $scope.awesomeThings);
      });
    }

    $scope.$on('$destroy', function () {
      socket.unsyncProgressBar('batchStatus');
    });

    /////////////////////////////////////// Force reparsing /////////////////////////////////////////////

    // $scope.limit = 50;
    // $scope.filesize = 10000;
    // $scope.targetType = 'parseAllFailedFiles';

    // $scope.parseThem = function(){

    //     console.log($scope.limit, $scope.filesize, $scope.targetType )
    //     init();
    //     ///reparse/:mode/:limite/:filesize
    //     $http.get('/api/thingiverses/reparse/'+$scope.targetType+'/'+$scope.limit+'/'+$scope.filesize).success(function(targetFiles) {
    //        $scope.batchStatus = {max:targetFiles.length, value:0};

    //        $scope.awesomeThings.length = 0;

    //        for(var i = 0 ; i < targetFiles.length; i ++){
    //            var target = targetFiles[i];
    //            var obj = {thing_id:target._thing.id, file_id:target.id,  file_name:target.name,  file_size:target.size, parsingMsg:''};
    //            $scope.awesomeThings.push(obj);
    //        }
    //        socket.syncUpdatesProgressBar('forceParsing', $scope.initStatus, $scope.batchStatus, $scope.awesomeThings);
    
    //    });
    // };

});
