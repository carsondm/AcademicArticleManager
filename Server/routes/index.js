var express = require('express');
var router = express.Router();

var User = require('../models/user');

/* ************************************************** */
/* ************************************************** */
/* ************************************************** */
/* THIS ENTIRE FILE NEEDS TO BE REWRITTEN. THIS IS    */
/* RAPID PROTOTYPING */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AAM | Index' });
});

// registration route
router.post('/register', function(req, res, next) {
	var user = User({
		email: req.body.email, 
		password: req.body.password, 
		confirm: req.body.confirm 		
	});

	user.save(function (err, user) {
  		if (err) return console.error(err);
  		console.log('Entered ' + user.email + ' into the DB');
	});

	res.render('register', {
		email: req.body.email, 
		password: req.body.password, 
		confirm: req.body.confirm 
	});
});

// login route
router.post('/login', function(req, res, next) {
	res.render('login', {
		email: req.body.email, 
		password: req.body.password, 
	});
});

module.exports = router;