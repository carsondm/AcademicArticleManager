var express = require('express');
var router = express.Router();

var Article = require('../models/article');


/* GET home page. */
router.get('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
  	if(err) return console.log(err);
  	
	res.render('results', { title: 'AAM | Results', results: results });
  });
});


router.post('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
  	if(err) return console.log(err);
  	
	res.render('results', { 
		title: 'AAM | Results', 
		search: req.body.search,
  		searchtype: req.body.options,
		results: results });
  });
});

module.exports = router;