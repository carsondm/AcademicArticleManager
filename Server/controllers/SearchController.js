var mongoose = require("mongoose");
var passport = require("passport");
var Article = require("../models/article");

var userController = {};

// Restrict access to root page
userController.home = function(req, res) {
  res.render('index', { user : req.user });
};

// Go to registration page
userController.register = function(req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function(req, res) {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      console.log('Error in AuthController.doRegister()');
      return res.render('register', { user : user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/');
    });
  }); 
};

// Go to login page
userController.login = function(req, res) {
  res.render('login');
};

// Post login
userController.doLogin = function(req, res) {
  passport.authenticate('local')(req, res, function () {
    console.log(JSON.stringify(req.session) + ' just logged in');
    res.render('login');
  });
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