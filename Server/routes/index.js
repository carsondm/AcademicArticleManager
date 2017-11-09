var express = require('express');
var router = express.Router();
var auth = require("../controllers/AuthController.js");

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
// router.post('/register', function(req, res, next) {
// 	var user = User({
// 		email: req.body.email,
// 		password: req.body.password,
// 		confirm: req.body.confirm
// 	});
//
// 	user.save(function (err, user) {
//   		if (err) return console.error(err);
//   		console.log('Entered ' + user.email + ' into the DB');
// 	});
//
// 	res.render('register', {
// 		email: req.body.email,
// 		password: req.body.password,
// 		confirm: req.body.confirm
// 	});
// });

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// login route
// router.post('/login', function(req, res, next) {
// 	res.render('login', {
// 		email: req.body.email,
// 		password: req.body.password,
// 	});
// });

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

module.exports = router;
