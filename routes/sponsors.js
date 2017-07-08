var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var apiurl = process.env.API_URL;
var imageUtil = require('../utilities/imageSizer.js');

/* GET race list page. */
router.get('/', function(req, res, next) {
  var sponsorRequest = rp(apiurl + 'sponsors?filter[is_active]=true');
  Promise.all([sponsorRequest]).then(function (data) {
    var sponsors = _.map(JSON.parse(data[0]).data, function (s) { return s.attributes; });
    imageUtil.processImageWidth(sponsors, 200);
    res.render('sponsors', { 
      title: 'Wasatch Trail Series Sponsors',
      sponsors: sponsors
    })
  });
});

module.exports = router;