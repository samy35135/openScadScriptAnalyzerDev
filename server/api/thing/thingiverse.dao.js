var mongoose = require('mongoose');

require('./model/Thing.model')();
require('./model/Tag.model')();
require('./model/Category.model')();
require('./model/Comment.model')();
require('./model/File.model')();

var Thing = mongoose.model('Thing');
var Tag = mongoose.model('Tag');
var Category = mongoose.model('Category');
var Comment = mongoose.model('Comment');
var File = mongoose.model('File');


exports.findTags
 = function(tag, callback){
	Tag
	.find({ name: new RegExp('^'+tag+'$', "i") })
	.populate('_thing', 'id') // only return the things id
	.exec(function(err, tags){
		if(err) throw err;
		callback(null, tags);
	});
}

// exports.findThingsByTag = function(tag, callback){
// 	Thing.find()
// 	.populate({
// 		path:'tags',
// 		match:{name:tag},
// 		select:'name, _id'
// 	}).exec(callback);
// }


