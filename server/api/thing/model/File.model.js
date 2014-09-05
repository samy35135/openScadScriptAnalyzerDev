
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var rq = require('../requestHelper');

var fs = require('fs');
var url = require('url');
var https = require('https');
var http = require('http');
var request = require('request');

//create an export function to encapsulate the model creation
module.exports = function() {
	
	var FileSchema = new Schema({
		_thing : { type: Schema.Types.ObjectId, ref: 'Thing' },
		id:Number,
		name:String,
		size:Number,
		url:String,
		public_url:String,
		threejs_url:String,
		thumbnail:String,
		default_image:String,
		date:Date,
		formatted_size:String,
		content:String,
		context:{},
		stat : [],
		isParsed : { type: Number, default: -1 } // -1:not parsed, 0: Failed, 1:OK
	});

	FileSchema.statics.getThisFromRemote = function (thing_id, cb) {
		rq.getRemoteObj(rq.getRequestQuery(['things',thing_id,'files']), cb);
	}

	function endsWith(str, suffix) {
	    return str.indexOf(suffix, str.length - suffix.length) !== -1;
	}

	function downloadScadFile(realLocation, cb){

		var options = {
		    host: url.parse(realLocation).host,
		    port: 443,
		    path: url.parse(realLocation).pathname
		};
		
		var req = https.request(options, function(res) {
		  res.on('data', function(d) {
		    cb(null, d.toString());
		  });
		});

		req.end();
		req.on('error', function(e) {
			console.error('error : ' + e);
			cb(e, null);
		});
	}

	FileSchema.methods.downloadAndSave = function (callback) {
		var fileObj = this;
		if(endsWith(this.name, 'scad')){
			var options = {
			    url: this.public_url,
			    method: 'GET'
			}
			// Start the request
			request(options, function (error, response, body) {
				if(error){
					callback(error);
				}else{

					if(response.headers['location'] === undefined){
						//callback("no file location " + body)
					
						fileObj.content = body;
						saveThis(fileObj, callback);
//							console.log(response.headers);


					}else{
						downloadScadFile(response.headers['location'], function(err, content){
							if(err){
								return callback(err);
							}
							fileObj.content = content;
							saveThis(fileObj, callback);
						});
					}

					
				}
			})
		}	
	}

	function saveThis(fileObj, callback){

		fileObj.save(function (err, result){
			if (err) {
				console.error('error : ' + e);
				callback(err, null);
			}else{
				callback(null, result);
			}
		});
		
	}

	mongoose.model('File', FileSchema);
}


