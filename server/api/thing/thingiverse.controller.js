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

exports.checkme = function(req, res){
  requestHelper.checkme(req.body.token, function(err, me){
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
    if(err) { return handleError(res, err); }
    return res.json(200, obj);
  });  
};


exports.list = function(req, res){
  thingiverseService.list(req.params.tag, req.params.page, function(err, things){
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  })
}

exports.stat = function(req, res){
  thingiverseService.stat(function(err, data){
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.reparse = function(req, res){
  var mode = req.params.mode;
  var limite = req.params.limite;
  var filesize = req.params.filesize;

  thingiverseService.reparse(mode, limite, filesize, function(err, data){
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.parseOneScad = function(req, res){
  thingiverseService.parseOneScad(function(err, data){
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

exports.getComplexScadListWithUseKey = function(req, res){
  getScadListWithKey(/use <([^>]*)>;?/);
}

exports.getComplexScadListWithIncludeKey = function(req, res){
  getScadListWithKey(/include <([^>]*)>;?/);
}

function getComplexScadList(regExp){
  thingiverseService.distinctIncludedFiles(regExp, function(err, data){
    if(err) { return handleError(res, err); }
    return res.json(200, data);
  })
}

function handleError(res, err) {
  return res.send(500, err);
}