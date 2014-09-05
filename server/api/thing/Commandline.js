process.env.NODE_ENV = "development";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dao = require('./thingiverse.dao');
var requestHelper = require('./requestHelper');

var d = require('./DataBag');
var parsingHelper = require('./parsingHelper');
var utils = require('./thingiverseUtils');

var Thing = mongoose.model('Thing');
var Tag = mongoose.model('Tag');
var Category = mongoose.model('Category');
var Comment = mongoose.model('Comment');
var File = mongoose.model('File');

var scadAnalyzer = require('./openScadAnalyzer');
var async = require('async');

var service = require('./thingiverse.service');

var devDB = 'mongodb://localhost/openscadanalyzer-dev';
var currentDB = devDB;

var socketMsgHelper = require('./socketMsgHelper');
socketMsgHelper.register(getSocket());

//list('iphone', 1);
function list(tag, page){
	doSomethingInDB(currentDB, function(){
		service.list(tag, 1, function(err, things){
			closeDB();
			print('totalCount : ' + things.totalCount);
			for(index in things.results){
				print('thing : ' + things.results[index].name);
			}
		});
	});//doSomethingInDB
}

//batch('customizer', 5);
function batch(tag, limitCnt){
	doSomethingInDB(currentDB, function(){
		//function(tag, limitCnt, cb)
		service.batch(tag, limitCnt, function(err, rtn){

			// please close the db connection after testing 
			print(rtn);
			//closeDB(); can't close the connection in this code!!!

		});//service.batchLimited
	});//doSomethingInDB
}

//statistics()
function statistics(){
	doSomethingInDB(currentDB, function(){
		
		service.stat(function(err, data){
			console.log(data);
			closeDB();
		})
	});//doSomethingInDB.length
                                     
}


//parsingHelperTest();
function parsingHelperTest(){
	doSomethingInDB(currentDB, function(){
		
		File
		.find({name:/scad/, isParsed : 0, size : {$lt:10000}})
		.populate('_thing', 'id') // only return the things id
		.exec(function(err, files){
			print('target count : '+ files.length);
			if(files.length == 0){
				closeDB();
			}else{
				var parser = parsingHelper.newParsingHelper();
				parser.startParsing();
				
				for(var i = 0 ; i < files.length ; i ++){
					parser.addTarget(files[i]);
				}
				// please close the db connection after testing 
				//closeDB(); can't close the connection in this code!!!				
			}			
		});
	});//doSomethingInDB.length
                                     
}

//parseNotParsedFiles();
function parseNotParsedFiles(){
	doSomethingInDB(currentDB, function(){
		
		File
		.find({name:/scad/, isParsed : -1, size : {$lt:10000}})
		.populate('_thing', 'id') // only return the things id
		.exec(function(err, files){

			var parser = parsingHelper.newParsingHelper(socketMsgHelper, 'forceParse');
			parser.startParsing();

			
			if(files.length == 0){
				closeDB();
			}else{

				
				for(var i = 0 ; i < files.length ; i ++){
					parser.addTarget(files[i]);
				}
				// please close the db connection after testing 
				//closeDB(); can't close the connection in this code!!!				
			}	
			
		});
	});//doSomethingInDB.length
                                     
}


//ObjectId("53ff0fd71378a7730d2f20bc")
//parseOneScad("540688c861a0244330920f67");
function parseOneScad(_id){
	doSomethingInDB(currentDB, function(){

		File.findById(_id, function(err, file){
			if(err) errHandler(err);
			if(file != null){
				print(file.name + ' : ' + file.size)
				scadAnalyzer.parse(file, function(err, file){
					if(err) errHandler(_id + ' : ' + err);
					else{
									
						file.save(function(err){
							if(err) errHandler(_id + ' : ' + err);
							print(file.stat);
							closeDB();
						});
					}				
				});//scadAnalyzer
			}else{print(_id + ' is null')}
			
		})//findById

	});//doSomethingInDB
}//parseOneScad


//distinctIncludedFiles(/use <([^>]*)>;?/);
//distinctIncludedFiles(/include <([^>]*)>;?/);
function distinctIncludedFiles(regExp){
	doSomethingInDB(currentDB, function(){
		//var regExp = /use <([^>]*)>;?/; <-- catch use tag
		//var regExp = /include <([^>]*)>;?/;	<-- catch include tag
		File.find({content:regExp}, function(err, files){
								
			var target = [];
			for(i in files){	
				var file = files[i];

				var lines = (file.content).split("\n");

				for (var i in lines){
					var line = lines[i];
					if(regExp.test(line)){
						//console.log(line)
						var obj = {id:file._id, name:file.name, line:line};
						target.push(obj);
					}
				}
			}
			var newTarget = _.uniq(target);
			console.log(newTarget);
			//////////////////////////////////////////////
			closeDB();
			//////////////////////////////////////////////
		});// find
	})	
}//distinctIncludedFiles()


//////////////////////////////////////////////////////////////////////////////////////
function closeDB(){
	mongoose.connection.close();
	print('connection closed');
}

function doSomethingInDB(dburi, outerCallback){
	mongoose.connect(dburi);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback () {
		try {
			// after doing , you should close the connection!!!!
			console.log('connection opened')
			outerCallback();

		}catch (e) {
			print(e);
			closeDB();
		}	
	});
}

function errHandler(err){
	console.log(err);	
	closeDB();
	return;
}

function print(msg){
	console.log(msg);
}

function getSocket(){
	return {
		emit: function(channel, info){
			console.log(channel, JSON.stringify(info));
		}
	}
}




function handleErr(title, err){
	console.log('!!! ERR --------------------\n '+ title + ' : ' + err + '\n------------------------');
}

function parsingErr(err){
	console.log('!!! PARSING ERR --------------------\n '+ err + '\n------------------------');
}