var express = require('express');
var router = express.Router();
var page = require('../models/page');

/* GET home page. */
router.get('/', function(req, res, next) {
  page.findOne({ where: { id: '2' } }).then(function (data) {
    res.render('series', { title: 'Express', data: data });
  });
});

module.exports = router;