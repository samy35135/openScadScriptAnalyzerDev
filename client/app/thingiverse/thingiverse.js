'use strict';

angular.module('openScadAnalyzerApp')
.config(function ($stateProvider) {
	$stateProvider
	.state('batch_job', {
    	url: '/thingiverse/batch',
    	templateUrl: 'app/thingiverse/batch.html',
    	controller: 'BatchCtrl'
    })
    .state('thingiverse', {
    	url: '/thingiverse/tag/:tag',
    	templateUrl: 'app/thingiverse/thingiverse.html',
    	controller: 'ThingiverseCtrl'
    })
    .state('parse', {
        url: '/thingiverse/parse',
        templateUrl: 'app/thingiverse/parse.html',
        controller: 'ParsingCtrl'
    });
});