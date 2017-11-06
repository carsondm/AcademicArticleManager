var express = require('express');
var router = express.Router();

var Article = require('../models/article');


// All queries can be handled with GET method, since it's not sensitive data
router.get('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.findByIdAndRemove({ _id: req.query.id },  function(err, results) {
  	if(err) return console.log(err);
  	
    console.log('Removed an article from the database');

    // Return to the results page
  	// res.render('results', { 
  	// 	title: 'AAM | Results', 
  	// 	search: req.query.search,
   //  	searchtype: req.query.options,
  	// 	results: results 
   //  });
    res.redirect('results');
  });
});

module.exports = router;