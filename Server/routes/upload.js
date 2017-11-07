var express = require('express');
var router = express.Router();

var Article = require('../models/article');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload', { title: 'AAM | Upload' });
});

router.post('/manualcreate', function(req, res, next) {
  var art = new Article({
    title: req.body.title,
    university: req.body.uni,
    author: req.body.author,
    tag: req.body.tags,
    snippet: req.body.snippet,
    owner: req.body.owner
  });

  art.save( function(err, art) {
    if(err) return console.log(err);
    return console.log('Manually created an article ' + art.title);
  });

  res.redirect('/results');
});

module.exports = router;