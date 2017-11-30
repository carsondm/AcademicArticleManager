var express = require('express');
var router = express.Router();

var Article = require('../models/article');
var SearchController = require('../controllers/SearchController');

// All queries can be handled with GET method, since it's not sensitive data
router.get('/', SearchController.search);

// Retrieve all articles
router.get('/all', SearchController.retrieveAll);

// Retrieve all articles in JSON format
router.get('/all/json', SearchController.retrieveAllJSON);

module.exports = router;