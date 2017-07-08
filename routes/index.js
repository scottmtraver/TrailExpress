var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var apiurl = process.env.API_URL;
var imageUtil = require('../utilities/imageSizer.js');

function parseRacesWithVenues (racesData) {
  var ret = []
  var venues = _.map(racesData.included, function (v) {
        return { id: v.id, venue: v.attributes };
      });

  _.forEach(racesData.data, function (r) {
    var race = r.attributes;
    race.venue = _.find(venues, function (v) { return v.id == r.relationships.venue.data.id; }).venue;
    var seodate = moment(race.date).format("MMM D YYYY").replace(/\s+/g, '-');
    race.isFuture = moment(race.date).isAfter(moment(new Date()).subtract(1, 'days'), 'date');
    race.seodate = seodate;
    ret.push(race)
  });
  // only display current year's races
  _.remove(ret, function (r) { return moment(r.date).year() != moment().year(); })
  ret.sort(function (a, b) {
    return moment.utc(a.date).diff(moment.utc(b.date));
  });
  return ret;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var homeRequest = rp(apiurl + 'pages/1');
  var raceRequest = rp(apiurl + 'races?include=venue');
  var cardRequest = rp(apiurl + 'cards?filter[is_active]=true&sort=order');
  var sponsorRequest = rp(apiurl + 'sponsors?filter[is_active]=true');
  Promise.all([homeRequest, raceRequest, cardRequest, sponsorRequest]).then(function (data) {
    var homepage = JSON.parse(data[0]).data.attributes;
    var races = parseRacesWithVenues(JSON.parse(data[1]));
    var cards = _.map(JSON.parse(data[2]).data, function (c) { return c.attributes; });
    var sponsors = _.sampleSize(_.map(JSON.parse(data[3]).data, function (s) { return s.attributes; }), 3);
    imageUtil.processImageWidth(sponsors, 200);

    res.render('index', { 
      title: 'Wasatch Trail Series Home',
      races: races,
      homepage: homepage,
      cards: cards,
      sponsors: sponsors
    })
  });
});

module.exports = router;