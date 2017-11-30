var mongoose = require("mongoose");
var passport = require("passport");

var ArticleController = require('../controllers/ArticleController');

var Article = require('../models/article');
var User = require("../models/user");

exports.viewAccount = function(req, res, next) {
  if( req.user ) {
    return res.render('account', {user: req.user, username: req.user.username});
  }
  else {
    console.log('Attempted access of account page from unauthenticated session.');
    return res.redirect('/');
  }
}

exports.viewUserArticles = function(req, res, next) {
  if( req.user ) {
    // Search article database for all articles uploaded by this user
    Article.find({'owner': req.user.username}, function(err, articles) {
      // Catch any errors during the query
      if(err) {
        console.log('Error in UserController.viewUserArticles: ' + err);
        return next(err);
      }

      // Log event and render page
      console.log('Rendering ' + req.user.username + '\'s articles from account.');
      return res.render('account-list-articles', {results: articles, user: req.user, username: req.user.username});
    });
  }
}

exports.viewUserBookmarks = function(req, res, next) {
  if( req.user ) {
    console.log(req.user);
    // Search article database for all articles uploaded by this user
    User.findOne({'username': req.user.username})
    .populate({
        path: 'bookmarks',
        select: 'title'
    })
    .exec(function(err, results) {
      // Catch any errors during the query
      if(err) {
        console.log('Error in UserController.viewUserBookmarks: ' + err);
        return next(err);
      }

      // Log event and render page
      console.log('Rendering ' + req.user.username + '\'s bookmarks from account.');

      return res.render('account-list-bookmarks', {results: results, user: req.user, username: req.user.username});
    });
  }
}

exports.changePassword = function(req, res, next) {
  if( req.session.passport ) {
    User.findByUsername(req.user.username).then(function(user) {
      if(user) {
        user.changePassword(req.body.currentpw, req.body.newpw, function(err) {
          if(err) {
            return res.send('Error changing password');
          }
          console.log('Changed password for ' + req.user.username);
          return res.send('success');
        });
      }
      else {
        console.log('User not found: ' + req.user.username);
        return res.send('User does not exist.');
      }
    }, function(err) {
      return res.send(err);
    });
  }
  else {
    console.log('Failed attempt at getting to account page.');
    return res.send('You are trying to access an account page when you aren\'t logged in');
  }
}

exports.changeName = function(req, res, next) {
  if( req.user ) {
    User.findOneAndUpdate({ username: req.user.username }, { $set: {firstName: req.body.first, lastName: req.body.last} }, {new: true}, function(err, user) {
      if(err) {
        return console.log('Error updating ' + user.username + '\'s name');
      }

      console.log('Successfully updated ' + user.username + '\'s name to ' + req.body.first + ' ' + req.body.last);
      return res.redirect('/account');
    });
  }
  else {
    return res.redirect('/');
  }
}

exports.changeEmail = function(req, res, next) {
  if( req.isAuthenticated() ) {
    var oldusr = req.user.username;
    var newuser = req.body.email;
    User.findOneAndUpdate({ username: req.user.username }, { $set: {username: req.body.email} }, {new: true}, function(err, user) {
      if(err) {
        return console.log('Error updating ' + user.username + '\'s email');
      }

      ArticleController.updateOwner(oldusr, newuser, next);

      console.log('Successfully updated ' + user.username + '\'s email to ' + req.body.email);
      return res.redirect('/account');
    });
  }
  else {
    return res.redirect('/');
  }
}
