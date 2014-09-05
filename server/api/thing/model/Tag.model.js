'use strict';

var rq = require('../requestHelper');
var findPaginated = require('./Pagination');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//create an export function to encapsulate the model creation
module.exports = function() {
	var TagSchema = new Schema({
	    _thing : { type: Schema.Types.ObjectId, ref: 'Thing' },
	    name : String,
	    url : String,
	    count : Number
	});
	
	TagSchema.statics.getThisFromRemote = function (thing_id, cb) {
		rq.getRemoteObj(rq.getRequestQuery(['things',thing_id,'tags']), cb);
	}
	TagSchema.statics.findPaginated = findPaginated;
	mongoose.model('Tag', TagSchema);
};