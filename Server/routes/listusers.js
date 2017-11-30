var express = require('express');
var router = express.Router();

var User = require('../models/user');


// All queries can be handled with GET method, since it's not sensitive data
router.get('/', function(req, res, next) {
  if( req.user ) {
    User.findOne({ 'username': req.session.passport.user },  function(err, result1) {
    	if(err) return console.log(err);
      if(result1.admin == false){
        console.log('Attempted access of User List from Non-Admin.');
        return res.render('index-loggedin', { errormessage: 'You must be an Admin to access the Users List', username: req.session.passport.user });
      }
      else {
        User.find( function(err, results) {
        	if(err) return console.log(err);

        	res.render('users', {
        		title: 'AAM | Users',
        		results: results,
            username: req.user.username});
          });
      }
      // else {
      //   console.log('Attempted access of User List from Non-Admin.');
      //   return res.render('index-loggedin', { errormessage: 'You must be an Admin to access the Users List' });
      // }
    });
  }
  else {
    console.log('Attempted access of User List from unauthenticated session.');
    return res.render('index', { errormessage: 'You must be logged in to access the Users List' });
    //return res.redirect('/');
  }
});

router.get('/listusers', function(req, res, next) {
  if( req.user ) {
    User.findOne({ 'username': req.session.passport.user },  function(err, result1) {
    	if(err) return console.log(err);
      if(result1.admin == false){
        console.log('Attempted access of User List from Non-Admin.');
        return res.render('index-loggedin', { errormessage: 'You must be an Admin to access the Users List', username: req.session.passport.user });
      }
      else {
        User.find( function(err, results) {
        	if(err) return console.log(err);

        	res.render('users', {
        		title: 'AAM | Users',
        		results: results,
            username: req.user.username});
          });
      }
      // else {
      //   console.log('Attempted access of User List from Non-Admin.');
      //   return res.render('index-loggedin', { errormessage: 'You must be an Admin to access the Users List' });
      // }
    });
  }
  else {
    console.log('Attempted access of User List from unauthenticated session.');
    return res.render('index', { errormessage: 'You must be logged in to access the Users List' });
    //return res.redirect('/');
  }
});

router.post('/delete', function(req, res, next) {
  var id = req.body._id;
  var message1 = 'Error in atttempt to delete User';
  var admin1 = false;
  console.log('Trying to delete: ' + id);

  User.findOne({ 'username': req.session.passport.user },  function(err, result1) {
  	if(err) return console.log(err);
    if(result1.admin == false)
      message1= 'Only Admins can delete users.'
    else {
      admin1 = true;
    }
    if(admin1){
      User.findByIdAndRemove({ '_id': id },  function(err, result) {
        if(err) return console.log(err);
        console.log('Found: ' + id + '. Attempting to delete...');
        console.log(req.session.passport.user + ' successfully deleted ' + id);
        message1= 'User Deleted.';
      });
    }
    else{
      console.log('Non-Admin user: ' + req.session.passport.user + ' has attempted to delete ' + id);
    }

    User.find( function(err, results) {
    	if(err) return console.log(err);

      return res.render('users', {
    		title: 'AAM | Users',
    		results: results,
        username: req.session.passport.user,
        message: message1});
    });
  });
});

router.post('/admin', function(req, res, next) {
  var id = req.body._id;
  var message1 = 'Error in atttempt to Adminize';
  var admin1 = false;
  console.log('Trying to adminize: ' + id);

  // Check to see if User is Admin
  User.findOne({ 'username': req.session.passport.user },  function(err, result1) {
  	if(err) return console.log(err);
    if(result1.admin == false)
      message1= 'Only Admins can adminize users.'
    else {
      admin1 = true;
    }
    if(admin1){
      User.findOneAndUpdate({ '_id': id }, { $set: {admin: true} }, {new: true}, function(err, user) {
        if(err) {
          return console.log('Error updating ' + id + ' to admin');
        }
        message1= 'User Adminized';
        console.log(req.session.passport.user + ' successfully updated ' + id + ' to Admin');
      });
    }
    else{
      console.log('Non-Admin user: ' + req.session.passport.user + ' has attempted to adminize ' + id);
    }

    User.find( function(err, results) {
      if(err) return console.log(err);
      return res.render('users', {
        title: 'AAM | Users',
        results: results,
        username: req.session.passport.user,
        message: message1});
    });
  });
});

module.exports = router;
