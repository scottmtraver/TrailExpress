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
  var seriesRequest = rp(apiurl + 'pages/2');
  var sponsorRequest = rp(apiurl + 'sponsors?filter[is_active]=true');
  Promise.all([seriesRequest, sponsorRequest]).then(function (data) {
    var series = JSON.parse(data[0]).data.attributes;
    imageUtil.processImageWidth([series], 250);
    var sponsors = _.sampleSize(_.map(JSON.parse(data[1]).data, function (s) { return s.attributes; }), 3);
    imageUtil.processImageWidth(sponsors, 200);
    res.render('series', { 
      title: 'Wasatch Trail Series Season Pass',
      series: series,
      sponsors: sponsors
    })
  });
});

module.exports = router;