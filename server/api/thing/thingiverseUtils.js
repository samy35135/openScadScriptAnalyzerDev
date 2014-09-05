'use strict';

// TODO standalone mode





/*
Header['link']
<https://api.thingiverse.com/tags/customizer/things?access_token=xxxxxxx&page=2>; rel="next", 
<https://api.thingiverse.com/tags/customizer/things>; rel="first", 
<https://api.thingiverse.com/tags/customizer/things?access_token=xxxxxxx&page=68>; rel="last"
*/
exports.getTotalPageFromHeader = function(header){
	if(header == undefined){
		return 0;
	}else{
		try{
			var rels = header.split(",");
			var rtn = rels[2].substr((rels[2].indexOf(">")-2), 2);

			return rtn;
		}catch(err){
			return 0;
		}
	}
}

exports.endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}



////////////////////////////////////////////////////////////////////////
exports.makeSocketMsg = function(max, value, thing){

	return {
		max: max, 
		value: value,
		thing_id : thing.id,
		tagCnt : thing.tags.length,
		categoryCnt : (thing.categories) ? thing.categories.length : 0,
		commentCnt : (thing.comments) ? thing.comments.length : 0,
		fileCnt : (thing.files) ? thing.files.length : 0 
	};
}

exports.makeSimpleSocketMsg = function(max, value){
	return {
		max: max, 
		value: value,
		thing_id : 0,
		tagCnt : 0,
		categoryCnt : 0,
		commentCnt : 0,
		fileCnt : 0
	};
}

exports.sendSocketMsg = function(socket, max, value, thing){
	var info = exports.makeSocketMsg(max, value, thing);
	socket.emit('batchStatus:progress', info);
	console.log('batchStatus:progress' +  JSON.stringify(info));
}

exports.sendSimpleSocketMsg = function(socket, max, value){
	var info = exports.makeSimpleSocketMsg(max, value);
	socket.emit('batchStatus:progress', info);
	console.log('batchStatus:progress' +  JSON.stringify(info));
}

exports.sendDownloadgMsg = function(socket, thing_id, msg){
	socket.emit('batchStatus:downloadScad', {thing_id:thing_id, msg:msg});
	console.log('batchStatus:downloadScad' +  JSON.stringify({thing_id:thing_id, msg:msg}));
}

exports.sendParsingMsg = function(socket, thing_id, parsingMsg){
	socket.emit('batchStatus:parsing', {thing_id:thing_id, parsingMsg:parsingMsg});
	console.log('batchStatus:parsing' +  JSON.stringify({thing_id:thing_id, parsingMsg:parsingMsg}));
}





////////////////////////////////////////////////////////////

