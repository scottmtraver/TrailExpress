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
  var races = rp('http://localhost:3001/api/races?include=venue');
  var sponsors = rp('http://localhost:3001/api/sponsors');
  Promise.all([races, sponsors]).then(function (data) {//races [0], sponsors [1]
    var races = parseRacesWithVenues(JSON.parse(data[0]));
    var sponsors = data[1];
    res.render('index', { 
      title: 'Wasatch Trail Series Home',
      races: races
    })
  });
});

module.exports = router;