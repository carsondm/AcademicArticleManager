var express = require('express');
var router = express.Router();

var User = require('../models/user');
var UserController = require('../controllers/UserController');

// Initial request will be from a GET request
router.get('/', UserController.viewAccount);

// Update user's email
router.post('/update-email', UserController.changeEmail);

// Update user's email
router.post('/update-name', UserController.changeName);

// Update user account details
router.post('/update-password', UserController.changePassword);

// View this user's posted articles
router.get('/myarticles', UserController.viewUserArticles);

// View this user's bookmarked articles
router.get('/mybookmarks', UserController.viewUserBookmarks);

module.exports = router;