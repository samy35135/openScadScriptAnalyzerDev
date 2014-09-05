'use strict';

angular.module('openScadAnalyzerApp')
.config(function ($stateProvider) {
	$stateProvider
	.state('main', {
		url: '/',
		templateUrl: 'app/main/main.html',
		controller: 'MainCtrl'
	});
});