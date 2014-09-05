



//////////////////// PUBLIC METHODS ///////////////////////////////////

var socket;
exports.register = function(_socket) {
	socket = _socket;
}

exports.sendSocketMsg = function(job, data){
	new SocketMsg(job, data).sendMsg();
}


///////////////////// PRIVATE METHODS /////////////////////////////////

var JobAndChannel = {  
	batch: 'batchStatus:progress', 
	parsing: 'batchStatus:parsing',
	downloadScad : 'batchStatus:downloadScad',
	forceParse : 'forceParsing:parse'
};

var JobAndMsg = {
	batch : function (data){return makeSocketMsg(data.max, data.value, data.thing);},
	downloadScad : function (data){return makeScadDownMsg(data);},//{thing_id:35135, msg:'OK'}
	parsing : function (data){return makeParsingMsg(data);},//{thing_id:35135, file_id:63521, msg:'OK'}
	forceParse : function (data){return makeParsingMsg(data);}
}

function SocketMsg(job, data){
	this.channel = JobAndChannel[job];
    this.msg = JobAndMsg[job](data);
    this.sendMsg = function () {
    	socket.emit(this.channel, this.msg);
    	console.log(job, this.channel, JSON.stringify(this.msg));
    };
}

function makeScadDownMsg(data){
	return {thing_id:data.thing_id, msg:data.msg};
}

function makeParsingMsg(data){
	return {thing_id:data.thing_id, file_id:data.file_id, parsingMsg:data.msg};
}

function makeSocketMsg(max, value, thing){
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

////////////////////// TEST METHODS ///////////////////////////////////

// function getSocket(){
// 	return {
// 		emit: function(channel, info){
// 			//console.log(channel, JSON.stringify(info));
// 		}
// 	}
// }

// function getMockThing(){
// 	var files = [];
// 	files.push({id:635241, name:'test1.scad', size:256});
// 	files.push({id:635242, name:'test2.scad', size:257});
// 	files.push({id:635243, name:'test3.scad', size:258});
// 	return {id:111, tags:[], categories:[], comments:[], files:files};
// }


// exports.sendSocketMsg(getSocket(), 'batch', {max:100, value:1, thing:getMockThing()});//{max:100, value:1, thing}
// exports.sendSocketMsg(getSocket(), 'downloadScad', {thing_id:35135, msg:'OK'});//{thing_id:thing_id, msg:msg}
// exports.sendSocketMsg(getSocket(), 'parsing', {thing_id:35135, file_id:63521, msg:'OK'});//{thing_id:thing_id, msg:msg}
// exports.sendSocketMsg(getSocket(), 'forceParse', {thing_id:35135, file_id:63521, msg:'OK'});




//console.log('batchStatus:parsing' +  JSON.stringify({thing_id:thing_id, parsingMsg:parsingMsg}));