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


////////////////////////////////////////////////////////////

