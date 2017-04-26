var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');

function parseRacesWithVenues (racesData) {
  var ret = []
  var venues = _.map(racesData.included, function (v) {
        return { id: v.id, venue: v.attributes };
      });

  _.forEach(racesData.data, function (r) {
    var race = r.attributes;
    race.venue = _.find(venues, function (v) { return v.id == r.relationships.venue.data.id; }).venue;
    ret.push(race)
  });
  return ret;
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var homeRequest = rp('http://localhost:3001/api/pages/1');
  var raceRequest = rp('http://localhost:3001/api/races?include=venue');
  var cardRequest = rp('http://localhost:3001/api/cards?filter[is_active]=true');
  var sponsorRequest = rp('http://localhost:3001/api/sponsors');
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