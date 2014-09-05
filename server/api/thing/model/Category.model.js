'use strict';

var rq = require('../requestHelper');

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//create an export function to encapsulate the model creation
module.exports = function() {
	var CategorySchema = new Schema({
		_thing : { type: Schema.Types.ObjectId, ref: 'Thing' },
	    name : String,
	    url : String
	});
	
	CategorySchema.statics.getThisFromRemote = function (thing_id, cb) {
		rq.getRemoteObj(rq.getRequestQuery(['things',thing_id,'categories']), cb);
	}
	
	mongoose.model('Category', CategorySchema);

}