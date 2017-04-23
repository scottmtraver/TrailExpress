var express = require('express');
var router = express.Router();
var pageModel = require('../models/page');
var raceModel = require('../models/race');
var extend = require('extend');

/* GET home page. */
router.get('/', function(req, res, next) {

  var r = raceModel.findAll();
  var p = pageModel.findOne({ where: { id: '1' }});

  Promise.all([r, p]).then(function (results) {// races [0], homepage[1]
    extend(req.base, { races: results[0], nextRace: null, homepage: results[1] })
    res.render('index', req.base);
  });
});

module.exports = router;