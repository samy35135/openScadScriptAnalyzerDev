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