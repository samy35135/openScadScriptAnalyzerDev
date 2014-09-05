'use strict';
//import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findPaginated = require('./Pagination');
var rq = require('../requestHelper');
//create an export function to encapsulate the model creation
module.exports = function() {
	
	var default_image = new Schema({
        type : String,
        size : String,
        url : String
    });

	// define a schema
	var ThingSchema = new Schema({    
	    id : Number,
	    name : String,
	    thumbnail : String,
	    url : String,
	    public_url : String,
	    creator : {
	        id : Number,
	        name : String,
	        first_name : String,
	        last_name : String,
	        url : String,
	        public_url : String,
	        thumbnail : String
	    },
	    added : Date,
	    modified : Date,
	    is_published : Boolean,
	    is_wip : Boolean,
	    is_featured : Boolean,
	    like_count : Number,
	    is_liked : Boolean,
	    collect_count : Number,
	    is_collected : Boolean,
	    default_image : {
	        id : Number,
	        url : String,
	        name : String,
	        sizes : [default_image],
	        added : Date
	    },
	    description : String,
	    tags : [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
	    categories : [{ type: Schema.Types.ObjectId, ref: 'Category' }],
	    files : [{ type: Schema.Types.ObjectId, ref: 'File' }],
	    comments : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
	});
	
	ThingSchema.statics.getThisFromRemote = function (thing_id, cb) {
	    rq.getRemoteObj(rq.getRequestQuery(['things',thing_id]), cb);
	}
	ThingSchema.statics.findPaginated = findPaginated;
	mongoose.model('Thing', ThingSchema);
};