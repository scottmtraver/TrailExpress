var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');

/* GET race list page. */
router.get('/', function(req, res, next) {
  var sponsorRequest = rp('http://localhost:3001/api/sponsors');
  Promise.all([sponsorRequest]).then(function (data) {
    var sponsors = _.map(JSON.parse(data[0]).data, function (s) { return s.attributes; });
    res.render('sponsors', { 
      title: 'Wasatch Trail Series Sponsors',
      sponsors: sponsors
    })
  });
});

module.exports = router;