var express = require('express');
var router = express.Router();

var fs = require('fs');
var Article = require('../models/article');
var UploadController = require('../controllers/UploadController');

// GET home page.
router.get('/manual/file', function(req, res, next) {
  res.render('upload', { title: 'AAM | Upload', username: req.session.passport.user });
});

// This is the route for manually creating an entry in the database
router.get('/manual/create', function(req, res, next) {
  res.render('create', { title: 'Manually create article', username: req.session.passport.user });
});

// Create database entry from form fields, with default file
router.post('/manual/file', UploadController.uploadAndParse);

// Create a file-less article, inserting fields by hand 
router.post('/manual/create', UploadController.manualCreate);


module.exports = router;
