// File origin: VS1LAB A3, A4

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');
var geoTagStore = new GeoTagStore();

const GeoTagExamples = require("../models/geotag-examples.js");

const LocationHelper = require("../public/javascripts/location-helper.js");
const { json } = require('express');

// App routes (A3)

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

router.get('/', (req, res) => {
  res.render('index', {
    taglist: geoTagStore.store,
    latitude: req.body.Latitude,
    longitude: req.body.Longitude
  });
});


// Route '/tagging' for HTTP 'Post' requests.
router.post('/tagging', (req, res) => {
  geoTagStore.addGeoTag(new GeoTag(req.body.Name, req.body.Latitude, req.body.Longitude, req.body.Hashtag))
  res.render('index', {
    taglist: geoTagStore.store,
    latitude: req.body.Latitude,
    longitude: req.body.Longitude
  })
});

// Route '/discovery' for HTTP 'POST' requests.
router.post('/discovery', (req, res) => {
  res.render('index', {
    taglist: geoTagStore.searchNearbyGeotags(req.body.Latitude, req.body.Longitude, 100, req.body.Search),
    latitude: req.body.Latitude,
    longitude: req.body.Longitude
  })
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get('/api/geotags', (req, res) => {
  var tags;
  var page = req.query.page === undefined ? 0 : parseInt(req.query.page);

  if (req.query.searchterm !== undefined) {
    var searchterm = decodeURIComponent(req.query.searchterm);
    if (req.query.latitude === undefined && req.query.longitude === undefined) {
      tags = geoTagStore.searchGeoTags(searchterm);
    }
    else {
      tags = geoTagStore.searchNearbyGeotags(req.query.latitude, req.query.longitude, 100, searchterm);
    }
  }
  else {
    tags = geoTagStore.store;
  }

  var resTags = tags.slice(page * 4, (page + 1) * 4);
  res.setHeader('tagAmount', tags.length);
  res.setHeader('Content-Type', 'application/json');
  res.json({ taglist: resTags })
});



/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  var tag = new GeoTag(req.body.name, req.body.latitude, req.body.longitude, req.body.hashtag);
  geoTagStore.addGeoTag(tag);
  var url = "/api/geotags/" + req.body.name;


  res.setHeader('tagAmount', geoTagStore.store.length);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('URL', url);
  res.json({ tag })

});



/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  var tag = geoTagStore.searchGeoTag(req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res.json(tag)
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  var tag = geoTagStore.searchGeoTag(req.params.id);
  tag.name = req.body.name;
  tag.hashtag = req.body.hashtag;
  tag.latitude = req.body.latitude;
  tag.longitude = req.body.longitude;
  res.setHeader('Content-Type', 'application/json');
  res.json({ tag })

});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  var tag = geoTagStore.searchGeoTag(req.params.id);
  geoTagStore.removeGeoTag(req.params.id);
  res.setHeader('tagAmount', geoTagStore.store.length);
  res.setHeader('Content-Type', 'application/json');
  res.json({ tag })

});
module.exports = router;
