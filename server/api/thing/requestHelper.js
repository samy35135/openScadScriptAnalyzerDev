var request = require('request');

var access_token;
var thingiverseDevUrl = "https://api.thingiverse.com";
var utils = require('./thingiverseUtils');
var async = require('async');

exports.checkme = function(token, cb){
	var uri = "https://api.thingiverse.com/users/me?access_token="+token;
	//https://api.thingiverse.com/users/me?access_token=b11a7055d1ee64a0b9fcf3333e77899c
	request(uri, function(err, response, body) {
		if (!err && response.statusCode == 200) {
			access_token = token;
			var me = JSON.parse(body);
			cb(null, me);
		}else{
			cb({msg:'bad token'}, null);
		}
	});
}

exports.getTotalCntOfThings = function(tag, cb){
	async.waterfall([
 		//1. request query
 		function(callback){			
 			var query = exports.getRequestQuery(['tags',tag,'things']);
 			request(query, callback); 
 		},
 		// 2. parse the total thing count & totalPage from the header
 		function(response, body, callback){
 			
 			var header = response.headers['link'];
 			var totalPageCnt = utils.getTotalPageFromHeader(header);
 			var lastPageUrl = exports.getRequestQuery(['tags',tag,'things']) + '&page='+ totalPageCnt;	

 			request(lastPageUrl, function(err, response, body) {
 				var jsonBody = JSON.parse(body);
 				// 30 things by default in one response of the thingiverse.com 
 				var totalRemoteThingsCnt = 30 * (totalPageCnt - 1) + jsonBody.length;	// get the total count of target here	
 				callback(null, totalPageCnt, totalRemoteThingsCnt);
 			});
 		}
 	],
 	// 3. as a result, totalPage, totalThingCnt found
 	function(err, totalPageCnt, totalRemoteThingsCnt) {
		if(err) throw err;
 		cb(null, totalPageCnt, totalRemoteThingsCnt);//max, value
 	});//async.waterfall
}

//exports.downloadThings = function(dataBag, currentPageNum, totalPageCnt, foundExistigCnt, callback){
exports.downloadThings = function(dataBag, currentPageNum, totalPageCnt, callback){
	var currentPage = exports.getRequestQuery(['tags', dataBag.tag, 'things']) + '&page='+ currentPageNum;
	request(currentPage, function(err, response, body) {
		
		if (!err && response.statusCode == 200) {
			//////////////////////////////////////////////
			var things = JSON.parse(body);// got 30 remote thing ids in one request
			//////////////////////////////////////////////
			for(var j = 0 ; j < things.length ; j++){
				
				var thing = things.pop();
				
				if(!dataBag.hasThis(thing.id)){
					
					//////////////// target /////////////////
					dataBag.addThingsToDownload(thing.id);
					/////////////////////////////////////////
					
					if(dataBag.isFull() || currentPageNum == totalPageCnt){						
						return callback();
						break;
					}
					
				}else{
					//foundExistigCnt++;
				}				
			}
			exports.downloadThings(dataBag, currentPageNum+1, totalPageCnt, callback);
		}		
	});	
}

//////////////////////////////////////////////////////////////
/**
GET /things/{$id}/
GET /things/{$id}/images/{$image_id}
GET /things/{$id}/files/{$file_id}
GET /things/{$id}/ancestors
GET /things/{$id}/derivatives
GET /things/{$id}/tags 
GET /things/{$id}/categories
GET /things/{$id}/threadedcomments : 
GET /comments/{$id}/
GET /files/{$id}/
GET /tags/{$tag}/things
*/
exports.getRequestQuery = function(pathArry){
	var url = thingiverseDevUrl;
	var i = 0;
	for(i in pathArry){
		url += '/' + pathArry[i];
	}
	url += '?access_token='+access_token;
	return url;
}

exports.getRemoteObj = function(query, cb){
	request(query, function(err, response, body) {
        if(err) throw err;
    	try{
    		var obj = JSON.parse(body);
    		return cb(null, obj);
    	}catch(err){
    		throw err;
    	}
    });
}

exports.getRemoteObject = function(Model, thing_id, _thing_id, callback){
	Model.getThisFromRemote(thing_id, function(err, objs){
		if(err) throw err;
		if(objs.length == 0){
				callback(null, []);
		}else{
			var count = 0;
			var ids = [];
			
			for(var i = 0 ; i < objs.length ; i ++){

				var obj = objs[i];
				obj._thing = _thing_id;
				new Model(obj).save(function (err, result){
					if (err) callback(err, null);
					else{
						count++;
						ids.push(result._id);
						if(count == objs.length){
							callback(null, ids);
						}
					}
				});
			}	
		}
			
	});
}