var express = require('express');
var router = express.Router();

router.use('/public', express.static(__dirname + "/public"));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bicycleFriend' });
});

var db = require('./serverApi.js');
router.get('/api/bikeParkings', db.getBikeParkings);
router.get('/api/restaurants', db.getRestaurants);
router.get('/api/touristSights',db.getTouristSights);
router.get('/api/recreationAreas', db.getRecreationAreas);
router.get('/api/cycloways', db.getCycloWays);
router.get('/api/checkCityExists', db.checkCityExists);
module.exports = router;
