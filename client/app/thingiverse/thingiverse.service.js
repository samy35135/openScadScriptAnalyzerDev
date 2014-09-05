'use strict';

angular.module('openScadAnalyzerApp')
.service('thingiverseListService', function () {

	// var $http;
	// var $scope;

	var things = [];
	var totalCount = 0 ;
	var currentPage = 1;
	var maxSize = 20;
	var tag = '';

	// var scope;
	// var http;
	// var window;

	// this.init = function($scope, $http, $window){
	// 	scope = $scope;
	// 	http = $http;
	// 	window = $window;
	// 	console.log('list service init done');
	// };
	
	this.goPage = function(page, tag, $http){
		var listUrl;

		if(tag){
			listUrl = '/api/thingiverses/list/' + tag + '/' + page;
		}else{
			listUrl = '/api/thingiverses/list/' + page;
		}
		console.log('listUrl : ' + listUrl);
		$http.get(listUrl).success(function(things) {
			things = things.results;
			totalCount = things.totalCount;
		});
	}

	// this.setPage = function(pageNo){
	// 	$scope.currentPage = pageNo;
	// }

	// this.pageChanged = function() {
	// 	console.log('Page changed to: ' + $scope.currentPage + '/' + $stateParams.tag);
	// 	goPage($scope.currentPage, $stateParams.tag);
	// }

	// this.isParsed = function(file){
	// 	if(file.isParsed == 1) return file.name + " [Parsed]";
	// 	if(file.isParsed == -1) return file.name + " [Not Parsed]";
	// 	else return file.name + " [Parsing Failed]"
	// }

	// this.getContent = function(content){	    	
	// 	return content.replace(/[\n\r]/g, '<br>');
	// }

	// this.getContext = function(context){	    	
	// 	return JSON.stringify(context, null, 4);
	// }

	// this.viewInNewTab = function(url,$window){
	// 	$window.open(url);
	// }

});
