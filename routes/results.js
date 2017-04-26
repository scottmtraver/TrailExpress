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

/* GET race list page. */
router.get('/', function(req, res, next) {
  var raceRequest = rp('http://localhost:3001/api/races?include=venue');
  var sponsorRequest = rp('http://localhost:3001/api/sponsors');
  Promise.all([raceRequest, sponsorRequest]).then(function (data) {
    var races = parseRacesWithVenues(JSON.parse(data[0]));
    var sponsors = _.sampleSize(_.map(JSON.parse(data[1]).data, function (s) { return s.attributes; }), 3);
    res.render('results', { 
      title: 'Wasatch Trail Series Races',
      races: races,
      sponsors: sponsors
    })
  });
});

module.exports = router;