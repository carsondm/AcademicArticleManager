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

// router.get('/bookmark/add/id/:dbid/', function(req, res, next) {
//   articleController.addBookmark;
  // if( req.isAuthenticated ) {
  //   // User.update({username: req.user.username}, {$addToSet: {bookmarks: req.params.dbid}}, {new: true},
  //   //   function(err) {
  //   //     if(err) { return console.log(err); }

  //   //     return console.log('Added bookmark to ' + req.user.username + '\'s bookmarks');
  //   //   });
  //   // User.findOne( { username: req.user.username }, function(err, user) {
  //   //   // I wanted this code to work like this, but could not find out
  //   //   //  how to do it. Should probably be fixed eventually
  //   //   // req.user.addBookmark(req.params.dbid);

  //   //   user.update({ $addToSet: {bookmarks: req.params.dbid}});

  //   //   return res.send('bookmark added');
  //   // });

  //   // return console.log('Couldn\'t find a user in article.js /bookmark/add');
  // }
  // else {
  //   res.send('unauthorized bookmark');
  //   return console.log('Unauthenticated request to bookmark.');
  // }
// });

module.exports = router;