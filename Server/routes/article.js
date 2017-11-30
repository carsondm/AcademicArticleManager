var express = require('express');
var router = express.Router();

var Article = require('../models/article');
var User = require('../models/user');

var articleController = require('../controllers/ArticleController');

router.get('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
  	if(err) return console.log(err);
  	
  	res.render('results', { 
  		title: 'AAM | ' + req.query.search, 
  		search: req.query.search,
    	searchtype: req.query.options,
  		results: results });
    });

  // Add find by and conditionals here for better searching
});

// Add this article to bookmarks
router.get('/bookmark/add/id/:dbid/', articleController.addBookmark);

router.get('/bookmark/remove/id/:dbid/', articleController.removeBookmark);

router.get('/download/id/:dbid', articleController.downloadOriginal);

router.get('/view/id/:dbid', articleController.viewArticle);

router.get('/embed/id/:dbid', articleController.embed);

module.exports = router;