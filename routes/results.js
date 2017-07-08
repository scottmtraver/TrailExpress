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
    var seodate = moment(race.date).format("MMM D YYYY").replace(/\s+/g, '-');
    race.seodate = seodate;
    race.isFuture = moment(race.date).isAfter(moment(new Date()).subtract(1, 'days'), 'date');
    race.venue = _.find(venues, function (v) { return v.id == r.relationships.venue.data.id; }).venue;
    ret.push(race)
  });
  ret.sort(function (a, b) {
    return moment.utc(a.date).diff(moment.utc(b.date));
  });
  return ret;
}

/* GET race list page. */
router.get('/', function(req, res, next) {
  var raceRequest = rp(apiurl + 'races?include=venue');
  var sponsorRequest = rp(apiurl + 'sponsors?filter[is_active]=true');
  Promise.all([raceRequest, sponsorRequest]).then(function (data) {
    var races = parseRacesWithVenues(JSON.parse(data[0]));
    var sponsors = _.sampleSize(_.map(JSON.parse(data[1]).data, function (s) { return s.attributes; }), 6);
    imageUtil.processImageWidth(sponsors, 200);
    res.render('results', { 
      title: 'Wasatch Trail Series Races',
      races: races,
      sponsors: sponsors
    })
  });
});

module.exports = router;