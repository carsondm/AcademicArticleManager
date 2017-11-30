var mongoose = require("mongoose");
var passport = require("passport");
var Article = require("../models/article");
var User = require("../models/user");
var fileUpload = require('express-fileupload');
var PythonShell = require('python-shell');

var fs = require('fs');

const { exec } = require('child_process');

var ArticleController = require('../controllers/ArticleController');
var FC = require('../controllers/FileController');

// ! This is bad and needs some review
// Insert new article into article database with fields defined by user, point file to real location
exports.manualFile = function(req, res, next) {
  // Check that the request has a file
  if(!req.files) {
    console.log('/upload was called without a file.');
    return res.status(400).send('No files were uploaded.');
  }

  // Variable for file, generate a path from the requesting user and filename
  let uploadedFile = req.files.file;
  console.log('UPLOADED FILE: ' + uploadedFile.name);
  let path = '/var/www/ArticleManager/articles/' + req.user.username + '/' + uploadedFile.name;
  var newPath = '/var/www/ArticleManager/articles/' + req.user.username;

  // Move the file from the temporary folder to a permanent location
  // FC.move( uploadedFile.path, path, function(err) {
  //   if(err) {
  //     console.log('Error in FC.move in UC.js');
  //     return next(err);
  //   }

  //   console.log('Moved the file');
  // });

  FC.makeSureDirectoryExists( newPath, function(err) {
    uploadedFile.mv(path, function(err, next) {
      if(err){
        return console.log('Error uploading ' + uploadedFile.name + '\n' + err);
      }

      // Create new Article instance, storing all form fields in the document    
      var article = new Article({
        title:      req.body.title,
        university: req.body.uni,
        author:     req.body.author,
        tag:        req.body.tags.split(/[ ,]+/),
        snippet:    req.body.snippet,
        owner:      req.user.username, 
        location:   path
      });


      // Save the article in the database, log event, catch error
      article.save( function(err, result) {
        if(err) {
          console.log('ERROR: ' + err);
          // return res.send('There was an error uploading your file.');
          return next(err);
        }

        console.log('FILE: ' + Date.now() + ' -- Saved ' + article.title + ' to database.');

        ArticleController.grobidParse( article.location, function(result) {
          console.log('Callback for grobidParse: ' + result);
        } );

        return res.redirect('/article/view/id/' + result._id);
      });

      // res.send('Uploaded file. Need to verify next.');
      // return res.render('verify-upload', {req: req});
    });
  });
}

// Insert new article into article database with fields defined by user, point file to default
exports.manualCreate = function(req, res, next) {
  var article = new Article({
    title:      req.body.title,
    university: req.body.uni,
    author:     req.body.author,
    tag:        req.body.tags.split(/[ ,]+/),
    snippet:    req.body.snippet,
    owner:      req.body.owner,
    locaiton:   '/var/www/ArticleManager/files/sample file.txt' 
  });

  article.save( function(err, article) {
    if(err) return console.log(err);
    return console.log('Manually created an article ' + art.title);
  });

  res.redirect('/search');
}

// Upload file, pass it to Java parsing program, take output, create new article object, save in DB
exports.uploadAndParse = function(req, res, next) {
  if( !req.user ) {
    return res.render('aam-error', {message: 'You need to be logged in to do that.'});
  }

  // Check that the request has a file
  if(!req.files) {
    console.log('/upload was called without a file.');
    return res.status(400).send('No files were uploaded.');
  }

  // Variable for file, generate a path from the requesting user and filename
  let uploadedFile = req.files.file;
  var newPath = '/var/www/ArticleManager/articles/' + req.user.username + '/';
  let articlePath = newPath + uploadedFile.name;

  // Check that the file exists, move it, add it to the database after parsing it
  FC.makeSureDirectoryExists(newPath, 
    moveArticle(null, newPath, uploadedFile, req, function(err, result) {
      if(err) {
        console.log(err);
        return res.render('aam-error', {username: req.user.username, message: 'There was an error processing your article. Sorry.'});
      }

      console.log('FILE: ' + Date.now() + ' -- Saved ' + result.title + ' to database.');

      return res.redirect('/article/view/id/' + result._id);
    })
  );
}

function moveArticle(err, newPath, uploadedFile, req, next) {
  uploadedFile.mv(newPath + uploadedFile.name.replace(/ /g, ''), 
    parseAndAddToDatabase(err, newPath, uploadedFile.name, req, function(err, result) {
        if(err) {
          console.log('Error moving file: ' + err);
          return next(err);
        }
        return next(err, result);
      })
    );
}

function parseAndAddToDatabase(err, newPath, fileName, req, next) {
  if(err) {
    return console.log('Error uploading ' + fileName + '\n' + err);
  }

  var articlePath = newPath + fileName;
  // var renamedPath = articlePath.replace(/ /g, '');

  fs.rename(articlePath, articlePath.replace(/ /g, ''), function(err) {
    console.log('Article Path inside parseAndAddToDatabase: ' + articlePath.replace(/ /g, ''));

    // var parsedArticle = ArticleController.grobidParse( articlePath,  );

    //./gradlew run -Pargs="/home/mark/TestFiles(PDF)/Health/ScienceArticle.pdf" 
    exec('cd /home/mark/Parser && ./gradlew run -q -Pargs=\"' + articlePath.replace(/ /g, '') + '\"', function(err, stdout, stderr) {
      if(err) {
        console.error('Failure running gradlew on ' + articlePath.replace(/ /g, ''));
        return next(err);
      }

      // console.log('Stderr: \n' + stderr);
      console.log('Stdout: \n' + stdout);
      var parserResult = JSON.parse(stdout);

      console.log('parserResult: ' + JSON.stringify(parserResult));

      // Create new Article instance, storing all form fields in the document    
      var article = new Article ({
        title:      parserResult.Title,
        university: parserResult.Publisher,
        author:     parserResult.Authors,
        tag:        parserResult.Tags,
        snippet:    parserResult.Abstract,
        category:   parserResult.Category, 
        subcategory:parserResult.Subcategory, 
        owner:      req.user.username, 
        location:   articlePath.replace(/ /g, '')
      });

      // Save the article in the database, log event, catch error
      article.save( function(err, result) {
        if(err) {
          console.log('ERROR: ' + err);
          // return res.send('There was an error uploading your file.');
        }
        return next(err, result);
      });

    });

  });
}