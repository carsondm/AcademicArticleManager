var express = require('express');
var router = express.Router();

var User = require('../models/user');


// Initial request will be from a GET request
router.get('/', function(req, res, next) {
  if( req.session.passport ) {
    User.findOne( { 'username' : req.session.passport.user }, function(err, results) {
      console.log(req.session.passport.user + ' just accessed the account page');
      return res.render('account', { 'user': results });
    });
  }
  else {
    console.log('Failed attempt at getting to account page.');
    return res.send('You are trying to access an account page when you aren\'t logged in');
  }
});

// Update user's email
router.post('/update-email', function(req, res, next){
  if( req.isAuthenticated() ) {
    User.findOneAndUpdate({ username: req.user.username }, { $set: {username: req.body.email} }, {new: true}, function(err, user) {
      if(err) {
        return console.log('Error updating ' + user.username + ' \'s username');
      }

      console.log('Successfully updated ' + user.username + ' \'s username');
      return res.redirect('/account');
    });
  }
  else {
    return res.redirect('/');
  }
});

// Update user's email
router.post('/update-name', function(req, res, next){
  if( req.isAuthenticated() ) {
    User.findOneAndUpdate({ username: req.user.username }, { $set: {firstName: req.body.first, lastName: req.body.last} }, {new: true}, function(err, user) {
      if(err) {
        return console.log('Error updating ' + user.username + ' \'s username');
      }
      
      console.log('Successfully updated ' + user.username + ' \'s username');
      return res.redirect('/account');
    });
  }
  else {
    return res.redirect('/');
  }
});

// Update user account details
router.post('/update-password', function(req, res, next){
  if( req.session.passport ) {
    User.findOne( {'username': req.session.passport.user }, function(err, user) {
      if(err) {
        return console.log(err);
      }
      if(!user) {
        return console.log('couldn\'t find ' + req.session.passport.user );
      }
      // if( user.validPassword(req.body.currentpw) ) {
      if( user.password == req.body.currentpw ) {
        console.log('user.password: ' + user.password);
        console.log('req.body.currentpw: ' + req.body.currentpw);
        return console.log('successfully verified user\'s password');
      }
      else {
        console.log('user.password: ' + user.password);
        console.log('req.body.currentpw: ' + req.body.currentpw);
        return console.log('probably should not be here');
      }
    });
  }
  else {
    console.log('Failed attempt at getting to account page.');
    return res.send('You are trying to access an account page when you aren\'t logged in');
  }
});

module.exports = router;