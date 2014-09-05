var parsingHelper = require('./parsingHelper');

function DataBag(tag, totalRemoteThingsCnt, limitCnt){
	//this.parser;
	this.tag = tag;
	this.totalRemoteThingsCnt = totalRemoteThingsCnt;
	this.limitCnt = limitCnt;
	this.thingsFromDB = [];
	this.thingsToDownload = [];
	this.maxCnt = 0;
	this.existingThingsCnt = 0;
}

DataBag.prototype.addThingsFromDB = function(tags) {
	this.thingsFromDB = [];		
    for(var i in tags){
    	this.hingsFromDB.push(tags[i]._thing.id);
    }
};

DataBag.prototype.hasThis = function(thing) {
	for(var i in this.thingsFromDB){
		if(thing == this.thingsFromDB[i])
			return true;
	}
	return false;
};

DataBag.prototype.isFull = function() {
	return (this.thingsToDownload.length == this.maxCnt)
};

DataBag.prototype.addThingsToDownload = function(target) {
	this.thingsToDownload.push(target);
};

DataBag.prototype.init = function(tags) {
	for(var i in tags){
		this.thingsFromDB.push(tags[i]._thing.id);
    }
	this.existingThingsCnt = this.thingsFromDB.length;
	
	this.maxCnt = this.totalRemoteThingsCnt - this.thingsFromDB.length;
	if(this.limitCnt != -1 && this.limitCnt < this.maxCnt){
		this.maxCnt = this.limitCnt;
	}
	
	//this.parser = parsingHelper.newParsingHelper(this.socket, 'parsing');
	//this.parser.startParsing();
};

DataBag.prototype.toString = function() {
	console.log('---- dataBack ----');
	console.log('tag : ' + this.tag);
	console.log('totalRemoteThingsCnt : ' + this.totalRemoteThingsCnt);
	console.log('limitCnt : ' + this.limitCnt);
	
	console.log('thingsFromDB : ' + this.thingsFromDB.length);
	console.log('thingsToDownload : ' + this.thingsToDownload.length);
	console.log('maxCnt : ' + this.maxCnt);
	console.log('------------------');
};


exports.newDataBack = function( tag, totalRemoteThingsCnt, limitCnt){
	return new DataBag(tag, totalRemoteThingsCnt, limitCnt);
}