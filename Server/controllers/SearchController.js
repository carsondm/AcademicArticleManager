var mongoose = require("mongoose");
var passport = require("passport");
var Article = require("../models/article");

// Retrieve all articles in the db
exports.search = function(req, res, next) {
  // retrieve all articles from the article collection
  var type = req.query.options;
  var search = req.query.search;
  var usrname;
  if( req.user ) usrname = req.user.username;
  console.log('Searching for ' + search + ' by ' + type + '.');
  // search = search.toLowerCase();

  // Article.find({ type: { $in: [search]} },  function(err, results) {
  //   if(err) return console.log(err);
  switch(type) {
    case 'tag':
      Article.find({'tag': { $in: [search]}}, function(err, results) {
        res.render('results',
        {
          title: 'AAM | ' + req.query.search,
          username: usrname,
          search: req.query.search,
          searchtype: req.query.options,
          results: results
        });
      });
      break;
    case 'author':
      Article.find({'author': search}, function(err, results) {
        res.render('results',
        {
          title: 'AAM | ' + req.query.search,
          username: usrname,
          search: req.query.search,
          searchtype: req.query.options,
          results: results
        });
      });
      break;
    case 'doi':
      Article.find({'doi': search}, function(err, results) {
        res.render('results',
        {
          title: 'AAM | ' + req.query.search,
          username: usrname,
          search: req.query.search,
          searchtype: req.query.options,
          results: results
        });
      });
      break;
    case 'subject':
      Article.find({'subject': search}, function(err, results) {
        res.render('results',
        {
          title: 'AAM | ' + req.query.search,
          username: usrname,
          search: req.query.search,
          searchtype: req.query.options,
          results: results
        });
      });
      break;
    default:
      res.render('aam-error', {username: req.user.username, message: 'unsupported search.'});
      break;
  }
}

function tagSearch(search, next) {
  Article.find({ 'tag': { $in: [search]}}, next(err, result));
}

function authorSearch(search, next) {
  Article.find({ 'author': search }, next(err, result));
}

function subjectSearch(req, res, next) {
  Article.find({ 'subject': search }, next(err, result));
}

function doiSearch(req, res, next) {
  Article.find({ 'doi': search }, next(err, result));
}

// Retrieve all articles in the db
exports.retrieveAll = function(req, res, next) {
  var usrname;
  var admin;
  if( !req.user ) {
    usrname = 'unregistered user';
    admin = false;
  }
  else {
    usrname = req.user.username;    
    admin = req.user.admin;
  }
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
    if(err) return console.log(err);

    res.render('results', {
      title: 'AAM | ' + req.query.search,
      username: usrname,
      admin: admin,
      search: req.query.search,
      searchtype: req.query.options,
      results: results });
    });
}

// Retrieve all articles in the db, respond with JSON
exports.retrieveAllJSON = function(req, res, next) {
  // retrieve all articles from the article collection
  Article.find( function(err, results) {
    if(err) return console.log(err);

    console.log('Sending all articles in JSON.');
    return res.send(results);
  });
}

// UPDATE:
// session user is stored in req.user.username

// !! NOTE
//  Session user is stored in req.session.passport.user
//  Output of JSON.stringify(req.session) is
//    {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"passport":{"user":"anothertest@test.com"}}
