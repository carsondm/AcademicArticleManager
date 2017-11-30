var express = require('express');
var router = express.Router();

var Article = require('../models/article');
var User = require('../models/user');

// All queries can be handled with GET method, since it's not sensitive data
//
// Goal is to change this functionality to an ajax request so a user can look at all their submissions
// on one page and delete them without reloading the page every time
//
// This is probably fine to stay the way it is, and all changes will need to be made to the manager page
//
router.get('/', function(req, res, next) {
  // admin flag
  var admin = 0;

  // Check to see if user is logged in
  if( req.user ) {
    // Check to see if user is admin
    User.findOne({ 'username': req.user.username },  function(err, resultUser) {
    	if(err) return console.log(err);
      if(resultUser.admin == false){
        console.log('Deletion - ' + req.user.username + ' is not an Admin');
      }
      else {
        admin = 1;
      }

      // retrieve all articles from the article collection
      Article.findOne({ '_id': req.query.id },  function(err, resultArticle) {
      	if(err) return console.log(err);

        console.log('Searching for article in remove.js');

        if( resultUser.username == resultArticle.owner || admin )
        {
          resultArticle.remove();
          console.log('Removed an article from the database.');
          return res.send( 'success' );
        }
        else {
          console.log(req.user.username + ' tried to remove ' + resultArticle.owner + '\'s article.');
          return res.send( 'unauthorized' );
        }
      });
    });
  }
});

module.exports = router;
