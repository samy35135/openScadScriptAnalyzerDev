var cliSupport = require('./Commandline');
var requestHelper = require('./requestHelper');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);
var promptText = "Please select one\n1. list by tag\n2. batch\n3. statistics\n"+
				 "4. find scad files which have 'use' keyword\n5. find scad files which have 'include' keyword\n" +
				 "6. parse scad files\n7. parse failed files\n8. parse one scad file\n\9. extract scad files\n";

rl.setPrompt(promptText);
rl.prompt();

rl.on('line', function(line) {
    switch(parseInt(line)) {
    case 1:
		getParams(rl, ['Tag','Page'], function(prompts, data){
			cliSupport.list(data[prompts[0]], data[prompts[1]], function(things){
				for(index in things.results){
					print('thing : ' + things.results[index].name);
				}
				print('totalCount : ' + things.totalCount);
				rl.close();
			});
		});
      	break;
    case 2:
    	checkme(function(){
			getParams(rl, ['Tag','Limit'], function(prompts, data){
				cliSupport.batch(data[prompts[0]], data[prompts[1]], function(){
					cliSupport.closeDB();
					rl.close();
				});
			});
		});
		break;
    case 3:
    	cliSupport.statistics(function(){
    		rl.close();
    	});
		break;
	case 4:
    	cliSupport.distinctIncludedFiles(/use <([^>]*)>;?/, function(){
    		rl.close();
    	});
		break;
	case 5:
    	cliSupport.distinctIncludedFiles(/include <([^>]*)>;?/, function(){
    		rl.close();
    	});
		break;
	case 6:
    	cliSupport.parseNotParsedFiles(-1, function(){
    		cliSupport.closeDB();
    		rl.close();
    	});
		break;
	case 7:
    	cliSupport.parseNotParsedFiles(0, function(){
    		cliSupport.closeDB();
    		rl.close();
    	});
		break;
	case 8:
		rl.question('target _id?', function(_id) {
	    	cliSupport.parseOneScad(_id, function(){
	    		rl.close();
	    	});
		});
		break;
	case 9:
		
		rl.question('mode? (1 : extract parsed scad files , 0 : extract parsing failed files)', function(mode){
			if(mode < 0 || mode > 1){
			  console.log('Saisir 0 ou 1');
			  rl.prompt();
			}else{
			  cliSupport.extractScadFiles(mode, function(){
				rl.close();
			  });
			}
		});
		break;
	case 10:
    		cliSupport.closeDB();
    		break;
    	default:
     	break;
    
  }
  rl.prompt();
}).on('close', function() {
  console.log('Have a great day!');
  process.exit(0);
});

function checkme(callback){
	rl.question('Access Token?', function(token) {
		requestHelper.checkme(token, function(err, me){
			if(err) {
				checkme(callback);
			}else{
				print('Hello ' + me.full_name)
				requestHelper.setAccessToken(token);
				callback();
			}
		});
	});
}






function getParams(rl, prompts, callback){
	var p = 0,
	data = {};
	var get = function() {
		  	rl.setPrompt(prompts[p] + '> ');
		  	rl.prompt();  
			p++
		};
	get();
	rl.on('line', function(line) {

	  	data[prompts[p - 1]] = line;
	  	//print(data[prompts[p - 1]]);
		if(p === prompts.length) {
			return callback(prompts,data);
		}else{
			get();
		}
	});
}

function print(msg){
	console.log(msg);
}












