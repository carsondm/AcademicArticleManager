var mongoose = require("mongoose");
var passport = require("passport");
var request = require('request');
var parseString = require('xml2js').parseString;
var http = require('http');
var fs = require('fs');

var Article = require("../models/article");
var User = require("../models/user");

// Add bookmark passed in req.params.dbid to user's account
exports.addBookmark = function(req, res, next) {
  if( req.user ) {
    User.findOneAndUpdate({username: req.user.username}, { $addToSet: {bookmarks: req.params.dbid}},
      function(err, user) {
        if(err) {
          console.log('Error adding bookmark to ' + req.user.username + '\'s bookmarks.');
          res.send('bookmark add error');
          return next(err);
        }

        console.log(user.username + ' added ' + req.params.dbid + ' to their bookmarks.');
        return res.send('bookmark added');
    });
  }
  else {
    res.send('Unauthenticated request in ArticleController.addBookmark.');
    return console.log('Unauthenticated request in ArticleController.addBookmark.');
  }
};

// Remove bookmark passed in req.params.dbid from user's account
exports.removeBookmark = function(req, res, next) {
  if( req.isAuthenticated() ) {
    User.findOneAndUpdate({username: req.user.username}, { $pull: {bookmarks: req.params.dbid}},
      function(err, user) {
        if(err) {
          console.log('Error removing bookmark from ' + req.user.username + '\'s bookmarks.');
          res.send('bookmark remove error');
          return next(err);
        }

        console.log(user.username + ' removed ' + req.params.dbid + ' from their bookmarks.');
        return res.send('bookmark removed');
    });
  }
  else {
    res.send('Unauthenticated request in ArticleController.removeBookmark.');
    return console.log('Unauthenticated request in ArticleController.removeBookmark.');
  }
};

// Remove bookmark passed in req.params.dbid from user's account
exports.downloadOriginal = function(req, res, next) {
  var username;
  if(req.user) {
    username = req.user.username;
  }
  else {
    username = 'unregistered user';
  }
  Article.findOne({'_id': req.params.dbid},
    function(err, article) {
      if(err) {
        console.log('Error downloading article ' + req.params.dbid);
        res.send('article download error');
        return next(err);
      }

      console.log(article.title + ' sent to ' + username);

      res.download( article.location );
  });
};

// Render the view for this article
exports.viewArticle = function(req, res, next) {
  var username;
  if( req.user.username ) username = req.user.username;
  Article.findOne({'_id': req.params.dbid}, function(err, article) {
    if( err ) {
      console.log('Error in ArticleController.viewArticle');
      return res.render('aam-error', {message: 'That article does not exist.'});
    }

    if(username) console.log('Article ' + article.title + ' viewed by ' + username);

    return res.render('article', {article: article, req: req, username: username});
  });
}

exports.updateOwner = function(oldowner, newowner, next) {
  console.log('Chaning the owner of ' + oldowner + '\'s articles.');
  Article.updateMany({'owner': oldowner}, {'owner': newowner}, function(err){
    if(err) {
      console.log('Error changing articles user.');
    }

    return next;
  });
}

// Send pdf for embedding
exports.embed = function(req, res, next) {
  Article.findOne({'_id': req.params.dbid}, function(err, article) {
    var filePath = article.location;

      fs.readFile(filePath , function (err,data){
          res.contentType("application/pdf");
          // res.contentDisposition("inline; filename=file.pdf");
          res.send(data);
    });
  });
}

// Use grobid to parse pdf
exports.grobidParse = function(article, next) {
  // send request to 
  // curl -v --form input=@./Data-Dependent\ Hashing\ Based\ on\ P-Table\ Distribution.pdf http://fupa.tech/api/processHeaderDocument

  var parsedArticle;
  var formData = {
    input: fs.createReadStream( article )
  }

  // Callbacks for handling grobid calls
  function grobidCallback(err, res, body, next) {
    if( !err && res.statusCode == 200 ) {
      console.log('grobid response: ' + body);
      handleGrobidResponse(body, next);
    }
    else {
      return console.log(err);
    }
  }

  function handleGrobidResponse(body, next) {
    parseString(body, function(err, result) {
      if(err) return console.log(err);
      parsedArticle = JSON.stringify(result);
    });
  }

  // Make the request to the grobid server, call the callback
  request.post({url: 'http://fupa.tech/api/processHeaderDocument', formData: formData}, grobidCallback);
  console.log('Completed categorize function');

  return next(parsedArticle);
}

// Get the category from meaningcloud.com
exports.categorize = function(article, next) {
  // /*https://www.meaningcloud.com/developer/text-classification/dev-tools/1.1*/
  // private String requestMeaningCloud(String title, String body) throws UnirestException{
  //     HttpResponse<String> response = Unirest.post("http://api.meaningcloud.com/class-1.1")
  //             .header("content-type", "application/x-www-form-urlencoded")
  //             .body("key=" + APIKEY +"&title=" + title + "&txt=" + body + "&model=IAB_en")
  //             .asString();

  var options = {
    uri: 'http://api.meaningcloud.com/class-1.1',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    body: 'key=' + APIKEY + '&title=' + article.title + '&txt=' + article.snippet + '&model=IAB_en'
  }

  function MCCallback(err, res, body) {
    if( !err && res.statusCode == 200 ) {
      console.log('Meaningcloud response: ' + body);
    }
  }

  request(options, MCCallback);
  console.log('Completed categorize function');
}
