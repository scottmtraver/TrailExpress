var express = require('express');
var router = express.Router();
var pageModel = require('../models/page');
var raceModel = require('../models/race');
var cardModel = require('../models/card');
var extend = require('extend');

/* GET home page. */
router.get('/', function(req, res, next) {

  var r = raceModel.findAll();
  var p = pageModel.findOne({ where: { id: '1' }});
  var c = cardModel.findAll({ where: { is_active: 'True' }});

  Promise.all([r, p, c]).then(function (results) {// races [0], homepage[1], cards[2]
    console.log(results[2])
    extend(req.base, { races: results[0], nextRace: null, homepage: results[1], cards: results[2] })
    res.render('index', req.base);
  });
});

module.exports = router;