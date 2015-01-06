/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */
'use strict';

var _ = require('lodash');
var requestHelper = require('./requestHelper');
var thingiverseService = thingiverseService = require('./thingiverse.service');

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
    //  new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: 'logs.log' })
    ]
  });

exports.getAccessToken = function (req, res) {
  requestHelper.getAccessToken(function(flag){
    logger.info('Fichier thingiverse.controller.js | fonction getAccessToken');
    console.log('flag ' + flag);
    return res.json(201, {hasAccessToken:flag});
  });
}

exports.checkme = function(req, res){
  requestHelper.checkme(req.body.token, function(err, me){
    logger.info('Fichier thingiverse.controller.js | fonction checkme');
    if(err) { return handleError(res, err); }
    return res.json(201, me);
  });
}


// Get list of thingiverses
exports.batch = function(req, res) {
  var tag = req.params.tag;
  var limite = req.params.limite;
  if(limite == null)
    limite = -1;

  thingiverseService.batch(tag, limite, function(err, obj){
    logger.info('Fichier thingiverse.controller.js | fonction batch');
    if(err) { return handleError(res, err); }
    return res.json(200, obj);
  });  
};


exports.list = function(req, res){
  thingiverseService.list(req.params.tag, req.params.page, function(err, things){
    logger.info('Fichier thingiverse.controller.js | fonction list');

    if(things.results.length > 1)
      console.log("Too many things can't show all parameters");
    else{
      
      //contains all parameters in an object
      var thingParams = {};

      console.log("Generate parameters for " + things.results[0].name + " :");

       //load the thing .scad content

      var textFile = "";
      
      for (var i = 0; i < things.results[0].files.length; i++) {
        //is a .scad file
        if(things.results[0].files[i].name.indexOf(".scad") != -1){
            console.log("Scad file found : " + things.results[0].files[i].name);
            textFile = things.results[0].files[i].content;
        }
      };

      //array that contains all the sliders
      thingParams.sliders = [];
      thingParams.dropdown = [];
      thingParams.imageToSurface = [];
      thingParams.imageToArray = [];
      thingParams.polygons = [];

      //regexp
      var sliders = /(\w*)\s*=\s*(\d)*;\s*\/\/\s*\[(\d*):(\d*)\]/g; 
      var dropdown = /(\w*)\s*=\s*(\d)*;\s*\/\/\s*\[([\d*|\s|,]*)\]/g;
      var imgToSurface = /(.*)\s*=\s*\"+(.*)\"+;\s*\/\/\s*\[image_surface:(\d*)x(\d*)]/g; 
      var imgToArray = /(.*)\s*=\s*(\[.*\]);\s*\/\/\s*\[image_array:(\d*)x(\d*)]/g; 
      var polygons = /(\w*)\s*=\s*\[\s*(\[.*]\s*]\s*),\[\s*(\[.*]\s*)\s*]\s*];\s*\/\/\s*\[draw_polygon:(\d*)x(\d*)\]/g;

      var m;
      var i = 0;

      while ((m = sliders.exec(textFile)) != null) {
          if (m.index === sliders.lastIndex) {
              sliders.lastIndex++;
          }
          if(m.index){
            thingParams.sliders[i] = { name : m[1], min : m[2], def : m[3], max : m[4]};
            i++;
          }
      }

      i = 0;

      while ((m = dropdown.exec(textFile)) != null) {
          if (m.index === dropdown.lastIndex) {
              dropdown.lastIndex++;
          }
          if(m.index){
            thingParams.dropdown[i] = { name : m[1], def : m[2], values : JSON.stringify(m[3].split(","))};
            i++;
          }
      }

      i = 0;

       while ((m = imgToSurface.exec(textFile)) != null) {

          if (m.index === imgToSurface.lastIndex) {

              imgToSurface.lastIndex++;
          }

          if(m.index){
            thingParams.imageToSurface[i] = { 
              name : m[1], 
              file : m[2], 
              width : m[3],
              height : m[4]
            };
            i++;
          }
          
      }

      i = 0;

      while ((m = imgToArray.exec(textFile)) != null) {

          if (m.index === imgToArray.lastIndex) {

              imgToArray.lastIndex++;
          }

          if(m.index){
            thingParams.imageToArray[i] = { 
              name : m[1], 
              points : JSON.stringify(m[2].split(",")), 
              paths : m[3],
              cols : m[4]
            };
            i++;
          }
      }

      i = 0;

      while ((m = polygons.exec(textFile)) != null) {

          if (m.index === polygons.lastIndex) {

              polygons.lastIndex++;
          }

          if(m.index){
            thingParams.imageToArray[i] = { 
              name : m[1], 
              array : m[2], 
              rows : m[3],
              width : m[4],
              height : m[5]
            };
            i++;
          }
      }



      //display result
      console.log(thingParams);
    }

    
    

    if(err) { return handleError(res, err); }
    return res.json(200, things);
    })
}

exports.stat = function(req, res){
  thingiverseService.stat(function(err, data){
    logger.info('Fichier thingiverse.controller.js | fonction stat');
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.reparse = function(req, res){
  var mode = req.params.mode;
  var limite = req.params.limite;
  var filesize = req.params.filesize;

  thingiverseService.reparse(mode, limite, filesize, function(err, data){
    logger.info('Fichier thingiverse.controller.js | fonction reparse');
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.parseOneScad = function(req, res){
  thingiverseService.parseOneScad(function(err, data){
    logger.info('Fichier thingiverse.controller.js | fonction parseOneScad');
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.getComplexScadListWithUseKey = function(req, res){
  logger.info('Fichier thingiverse.controller.js | fonction getComplexScadListWithUseKey');
  getScadListWithKey(/use <([^>]*)>;?/);
}

exports.getComplexScadListWithIncludeKey = function(req, res){
  logger.info('Fichier thingiverse.controller.js | fonction getComplexScadListWithIncludeKey');
  getScadListWithKey(/include <([^>]*)>;?/);
}

function getComplexScadList(regExp){
  thingiverseService.distinctIncludedFiles(regExp, function(err, data){
    logger.info('Fichier thingiverse.controller.js | fonction getComplexScadList');
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

function handleError(res, err) {
  logger.info('Fichier thingiverse.controller.js | fonction handleError');
  return res.send(500, err);
}