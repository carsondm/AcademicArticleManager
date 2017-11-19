var mongoose = require("mongoose");
var passport = require("passport");
// var Article = require("../models/article");
var User = require("../models/user");

// var articleController = {};

module.exports.addBookmark = function(req, res, next) {
  if( req.isAuthenticated() ) {
    User.findOneAndUpdate({username: req.user.username}, { $addToSet: {bookmarks: req.params.dbid}}, 
      function(err, user) {
        if(err) {
          console.log('Error adding bookmark to ' + req.user.username + '\'s bookmarks.');
          res.send('bookmark error');
          return next(err);
        }

        console.log(user.username + ' added ' + req.params.dbid + ' to their bookmarks.');
        return res.send('bookmark added');
    });
  }
  else {
    res.send('Unauthenticated request in ArticleController.addBookmark.');
    return console.log('Unauthenticated request in ArticleController.addBookmark.');
  }

  // return res.send('Something went very wrong');
};

// module.exports = articleController;