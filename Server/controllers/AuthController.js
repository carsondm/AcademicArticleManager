var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/user");
var fs = require('fs');

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user, message: req.flash('error') });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ email : req.body.email, username: req.body.email, firstName: req.body.first, lastName: req.body.last, admin: '0' }), req.body.password, function(err, user) {
    if (err) {
      console.log('Error in AuthController.doRegister()');
      return res.render('index', { message : 'Error while attempting to Register account.' });
    }

    passport.authenticate('local')(req, res, function () {
      fs.mkdir('/var/www/ArticleManager/articles/' + req.body.email);
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = function(req, res) {
  //res.render('login');
  res.render('index');
};

// Post login
userController.doLogin = function(req, res, next) {
  // passport.authenticate('local', { failureRedirect: '/', failureFlash: 'Invalid username or password.' })(req, res, function () {
  //   console.log(JSON.stringify(req.session) + ' just logged in');
  //   //res.render('index-loggedin');
  //   res.render('index-loggedin', { username: req.user.username })
  // });

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      console.log('Invalid login attempt for: ' + req.body.email);
      return res.render('index', { message: 'Invalid username or password' }); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(JSON.stringify(req.session) + ' just logged in');
      return res.render('index-loggedin', { username: req.user.username });
    });
  })(req, res, next);

};

// logout
userController.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

module.exports = userController;


// !! NOTE
//  Session user is stored in req.session.passport.user
//  Output of JSON.stringify(req.session) is
//    {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"anothertest@test.com"}}
