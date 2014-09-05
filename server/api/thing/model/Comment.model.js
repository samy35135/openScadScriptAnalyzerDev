'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var rq = require('../requestHelper');

//create an export function to encapsulate the model creation
module.exports = function() {

	var CommentSchema = new Schema(
	{
	    _thing : { type: Schema.Types.ObjectId, ref: 'Thing' },
		id : Number,
		url : String,
		target_type:String,
		target_id:Number,
		public_url:String,
		target_url:String,
		body:String,
		user:{
	        id : Number,
	        name : String,
	        first_name : String,
	        last_name : String,
	        url : String,
	        public_url : String,
	        thumbnail : String},
	    added:Date,
	    modified:Date,
	    parent_id:Number,
	    parent_url:String,
	    is_deleted:Boolean}
	);
	
	CommentSchema.statics.getThisFromRemote = function (thing_id, cb) {
	    rq.getRemoteObj(rq.getRequestQuery(['things',thing_id,'comments']), cb);
	}
	
	mongoose.model('Comment', CommentSchema);

};
