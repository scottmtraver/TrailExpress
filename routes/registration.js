var express = require('express');
var router = express.Router();
var page = require('../models/page');

/* GET home page. */
router.get('/', function(req, res, next) {
  page.findOne({ where: { id: '3' } }).then(function (data) {
    res.render('registration', { title: 'Express', data: data });
  });
});

module.exports = router;