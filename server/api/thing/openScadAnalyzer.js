var requirejs = require('requirejs');

var config = require('../../config/environment');

requirejs.config({
    baseUrl: config.root + '/node_modules/openscad-openjscad-translator/src',
    paths: {
		lib: config.root + '/node_modules/openscad-openjscad-translator/lib'
	},
    nodeRequire: require
});

requirejs(["async", "path", "fs", "openscad-parser", "Globals", "openscad-parser-support", "lib/underscore"], 
function(async, path, fs, parser, Globals, parser_support) {

//exports.targets = [];


exports.parse = function(file, callback){
	try{	
		file.isParsed = 0;
		// init
		parser.yy = {};
		if(file.stat.length > 0){
			file.context = {};
			file.stat.splice(0,file.stat.length);
		}

		var openSCADText = Globals.preParse(file.content);
		openSCADText = mergeFiles(openSCADText);// use, include files
		var openJSCADResult = parser.parse(openSCADText);
		
		// init parser
		parser.yy.context  = {};
		parser.yy = {};


		var context = openJSCADResult.context;

		// Circular reference 
		var cache = [];
		var toto = JSON.stringify(context, function(key, value) {
		    if (typeof value === 'object' && value !== null) {
		        if (cache.indexOf(value) !== -1) {
		            // Circular reference found, discard key
		            return;
		        }
		        // Store value in our collection
		        cache.push(value);
		    }
		    return value;
		});
		cache = null; // Enable garbage collection
		

		context = toto.replace(/\$/gi, "_");
		file.context = JSON.parse(context);
		file.isParsed = 1;// parsig success 
		
		analyseAllContext(file.context, file, function(err, rtn){
			callback(null, rtn);	
		});
		

	}catch(err){
		 console.log(file._id + ' failed');
		file.isParsed = 0;
		callback(err, file);
	}
}

function mergeFiles(openSCADText){

	var lines = openSCADText.split("\n");

	for (var i in lines){
		var line = lines[i];

		lines[i] = line.replace(/include <([^>]*)>;?/, function(match, p1, offset, string) {
			console.log('include match 1 : ' + match);

			var includedModuleText = fs.readFileSync(getLibFile(p1), "UTF8");
			includedModuleText = Globals.preParse(includedModuleText);
			return includedModuleText;
		});

		lines[i] = line.replace(/use <([^>]*)>;?/, function(match, p1, offset, string) {
			console.log('use match 1 : ' + match);
			/*
			match : use <MCAD/fonts.scad>
			p1 : MCAD/fonts.scad
			offset : 0
			string : use <MCAD/fonts.scad>
			*/				
			var usedModuleText = fs.readFileSync(getLibFile(p1), "UTF8");
			usedModuleText = Globals.preParse(usedModuleText);
			var usedModuleResult = parser.parse(usedModuleText);

			parser.yy.context = usedModuleResult.context;
			
			return match;
		});
	}

	return lines.join('\n');
}

/*
	build_plate.scad
	write.scad
	pins.scad

	MCAD/*.scad
	shapes.scad --> MCAD

	MCAD/fonts.scad
 */
function getLibFile(fileName){

	var basename = config.root + '/server/api/thing/openscadLib/' + fileName;
	if(fs.existsSync(basename)){
 		console.log('[FOUND] ' +basename);
		return basename;
	}else{
		basename = config.root + '/server/api/thing/openscadLib/' + path.basename(fileName);
		if(fs.existsSync(basename)){
			console.log('[FOUND] ' +basename);
			return basename;
		}
	}
	console.log(basename + ' not found');
	return basename;
}


function analyseAllContext(context, file, callback){

	if(context.parentContext == undefined){
		callback(null, file);
	}else{
		file.stat.push(analyseContext(context));
		analyseAllContext(context.parentContext, file, callback);
	}
}

/*

totalFuncCnt
totalModuleCnt
mostComplexFuncArgCnt;
mostComplexModuleArgCnt;

*/

function analyseContext(context){

	var totalModuleCnt = 0;
	var mostComplexModuleArgCnt = 0;
	var totalFuncCnt = 0;
	var mostComplexFuncArgCnt = 0;
	var globalArgCnt = 0;
	
	var modules_p = context.modules_p;
	if(modules_p != undefined){
		if(modules_p.length > 0){
			totalModuleCnt = modules_p.length;
			for(var i = 0 ; i < totalModuleCnt ; i ++){
				var module = modules_p[i];
				var name = module.name;
				var argCnt = module.argexpr.length;
				if(mostComplexModuleArgCnt < argCnt){
					mostComplexModuleArgCnt = argCnt;
				}
				
			}
		}
	}
	
	
	var functions_p = context.functions_p;
	if(functions_p != undefined){
		for(key in functions_p){
			totalFuncCnt++;
			var f = functions_p[key];
			//console.log(f.argnames)
			if(mostComplexFuncArgCnt < f.argnames.length){
				mostComplexFuncArgCnt = f.argnames.length;
			}
		}
	}
	

	var vars = context.vars;	
	if(functions_p != undefined){
		for(key in vars){
			globalArgCnt++;
		}
	}

	return {
		totalModuleCnt : totalModuleCnt, 
		mostComplexModuleArgCnt : mostComplexModuleArgCnt,
		totalFuncCnt : totalFuncCnt,
		mostComplexFuncArgCnt : mostComplexFuncArgCnt,
		globalArgCnt : globalArgCnt
	}
}

});