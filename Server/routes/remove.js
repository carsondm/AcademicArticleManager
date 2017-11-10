var express = require('express');
var router = express.Router();

var Article = require('../models/article');


// All queries can be handled with GET method, since it's not sensitive data
// 
// Goal is to change this functionality to an ajax request so a user can look at all their submissions
// on one page and delete them without reloading the page every time
//
// This is probably fine to stay the way it is, and all changes will need to be made to the manager page
// 
router.get('/', function(req, res, next) {
  // retrieve all articles from the article collection
  Article.findOne({ '_id': req.query.id },  function(err, result) {
  	if(err) return console.log(err);

    // check that the user trying to delete the file is the owner
    // 
    // This will be checked against a session cookie when accounts are implemented
    if( req.session.passport.user != result.owner ) {
      console.log(req.session.passport.user + ' tried to remove ' + result.owner + '\'s article.');
      return res.send( 'unauthorized' );
    }
    else {
      result.remove();
      console.log('Removed an article from the database');
      return res.send( 'success' );
    }
  });
});

module.exports = router;