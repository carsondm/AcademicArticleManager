var express = require('express');
var router = express.Router();

var User = require('../models/user');


// All queries can be handled with GET method, since it's not sensitive data
router.get('/', function(req, res, next) {
  // retrieve all users from the users collection
  User.find( function(err, results) {
  	if(err) return console.log(err);

  	res.render('users', {
  		title: 'AAM | Users',
  		results: results,
      username: req.session.passport.user});
    });

  // Add find by and conditionals here for better searching
});

module.exports = router;
