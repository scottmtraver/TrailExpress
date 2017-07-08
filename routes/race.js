var express = require('express');
var router = express.Router();
var extend = require('extend');
var rp = require('request-promise');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
var apiurl = process.env.API_URL;

function parseRacesWithVenuesAndSponsors (racesData) {
  var ret = []
  var included = _.map(racesData.included, function (v) {
        return { id: v.id, model: v.attributes, type: v.type };
      });
  var venues = _.filter(included, { 'type': 'venues' });
  var sponsors = _.filter(included, { 'type': 'sponsors' });

  _.forEach(racesData.data, function (r) {
    var race = r.attributes;
    var seodate = moment(race.date).format("MMM D YYYY").replace(/\s+/g, '-');
    race.seodate = seodate;
    race.venue = _.find(venues, function (v) { return v.id == r.relationships.venue.data.id; }).model;
    if(r.relationships.sponsor.data) {
        race.sponsor = _.find(sponsors, function (v) { return v.id == r.relationships.sponsor.data.id; }).model;
    }
    ret.push(race)
  });
  return ret;
}

/* GET race list page. */
router.get('/:date', function(req, res, next) {
  var raceRequest = rp(apiurl + 'races?include=sponsor&include=venue');
  var sponsorRequest = rp(apiurl + 'sponsors?filter[is_active]=true');
  Promise.all([raceRequest, sponsorRequest]).then(function (data) {
    var races = parseRacesWithVenuesAndSponsors(JSON.parse(data[0]));
    var race = _.find(races, function (r) { 
        return r.seodate == req.params.date;
    });
    if(!race.sponsor) {
        race.sponsor = _.sampleSize(_.map(JSON.parse(data[1]).data, function (s) { return s.attributes; }), 1)[0];// pick 1
    }

    res.render('race', { 
      title: 'Wasatch Trail Series Race',
      race: race,
    })
  });
});

module.exports = router;