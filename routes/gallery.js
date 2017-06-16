var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var apiurl = process.env.API_URL;

/* GET race list page. */
router.get('/', function(req, res, next) {
  res.render('gallery', { 
    title: 'Wasatch Trail Series Gallery',
  });
});

module.exports = router;