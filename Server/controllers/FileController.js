var mongoose = require("mongoose");
var passport = require("passport");

var Article = require('../models/article');
var User = require("../models/user");

var fs = require('fs');

// Function to move file from sourcePath to destPath
exports.move = function( sourcePath, destPath, next ) {
  // Make sure the destination exists
  makeSureDirectoryExists( destPath , function(err) {
    if(err) {
      console.log('Error when executing makeSureDirectoryExists!');
      return next(err);
    }

    console.log('Success in makeSureDirectoryExists!');
  });

  // Open read/write streams
  var source = fs.createReadStream( sourcePath );
  var dest = fs.createWriteStream( destPath );

  // Send the file from source to dest
  source.pipe(dest);
  source.on('end', function(){
    console.log('FC.js: ' + Date.now + ' -- Moved ' + sourcePath + ' to ' + destPath + '.');
  });
  source.on('error', function() {
    console.log('ERROR: ' + Date.now + ' -- Couldn\'t move ' + sourcePath + ' to ' + destPath + '.');
  });
};

//!!! According to Node.js docs, this isn't how I should be handling this. This call should be made after an attempt
//    to write to the directory. 
// Check if directoryPath is a directory, create it if it isn't
exports.makeSureDirectoryExists = function( directoryPath, next ) {
  fs.stat( directoryPath , function(err, stats) {
    
    if(err) {
      // The error should be about directory not existing, everything else is unknown, throw those
      console.log('FC.js: ' + Date.now() + ' -- ' + directoryPath + ' isn\'t a directory.');

      fs.mkdir(directoryPath, function(err) {
        if(err) {
          consolge.log('Error creating ' + directoryPath + ': ' + err);
          return next(err);
        }

        return console.log('FC.js: ' + Date.now + ' -- Created ' + directoryPath + '.');
      });
    }

    // If it exists but isn't a directory, create the directory
    // ! This should never actually happen
    if( !stats.isDirectory() ) {
     fs.mkdir(directoryPath, function(err) {
        if(err) {
          return next(err);
        }

        console.log('FC.js: ' + Date.now() + ' -- Created ' + directoryPath + '.');
      }); 
    } 
    else {
      console.log('FC.js: mSDE(): ' + Date.now() + ' -- ' + directoryPath + ' is a directory, no action needed.');
      // return next(err); 
    }
  }); 

}