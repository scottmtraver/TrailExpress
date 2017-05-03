var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var apiurl = process.env.API_URL;

function parseRacesWithVenues (racesData) {
  var ret = []
  var venues = _.map(racesData.included, function (v) {
        return { id: v.id, venue: v.attributes };
      });

  _.forEach(racesData.data, function (r) {
    var race = r.attributes;
    race.venue = _.find(venues, function (v) { return v.id == r.relationships.venue.data.id; }).venue;
    var seodate = moment(race.date).format("MMM D YYYY").replace(/\s+/g, '-');
    race.seodate = seodate;
    ret.push(race)
  });
  ret.sort(function (a, b) {
    return moment(a.date).isAfter(moment(b.date));
  });
  return ret;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var homeRequest = rp(apiurl + 'pages/1');
  var raceRequest = rp(apiurl + 'races?include=venue');
  var cardRequest = rp(apiurl + 'cards?filter[is_active]=true');
  var sponsorRequest = rp(apiurl + 'sponsors');
  Promise.all([homeRequest, raceRequest, cardRequest, sponsorRequest]).then(function (data) {
    var homepage = JSON.parse(data[0]).data.attributes;
    var races = parseRacesWithVenues(JSON.parse(data[1]));
    var cards = _.map(JSON.parse(data[2]).data, function (c) { return c.attributes; });
    var sponsors = _.sampleSize(_.map(JSON.parse(data[3]).data, function (s) { return s.attributes; }), 3);
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