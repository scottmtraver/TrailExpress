var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessMiddleware = require('less-middleware');
var extend = require('extend');
var moment = require('moment');
var _ = require('underscore');

// Primart Routes
var index = require('./routes/index');
var registration = require('./routes/registration');
var series = require('./routes/series');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

var base = {
  title: 'Wasatch Trail Series',
}

var sponsorsModel = require('./models/sponsor');

function pageTemplate (req, res, next) {
  sponsorsModel.findAll().then(function (sponsors) {
    req.base = {};
    extend(true, req.base, base);
    req.base.sponsors = _.sample(sponsors, 10);
    req.base.allSponsors = sponsors;
    next();
  });
}

app.use(pageTemplate);

// Route mappings (capitalization)
app.use('/', index);
app.use('/Registration', registration);
app.use('/Series', series);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
