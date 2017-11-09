var express = require('express');
var router = express.Router();

var Article = require('../models/article');


// All queries can be handled with GET method, since it's not sensitive data
router.get('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
  	if(err) return console.log(err);
  	
	res.render('results', { 
		title: 'AAM | Results', 
		search: req.query.search,
  	searchtype: req.query.options,
		results: results });
  });
});

module.exports = router;