var express = require('express');
var router = express.Router();
var fileUpload = require('express-fileupload');

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
    tag: req.body.tags.split(/[ ,]+/),
    snippet: req.body.snippet,
    owner: req.body.owner
  });

  art.save( function(err, art) {
    if(err) return console.log(err);
    return console.log('Manually created an article ' + art.title);
  });

  res.redirect('/search');
});

router.post('/', function(req, res, next) {
	if(!req.files) {
		console.log('/upload was called without a file.');
		// return res.status(400).send('No files were uploaded.');
		return res.send(req.files.file);
	}

	let uploadedFile = req.files.file;

	uploadedFile.mv('/home/ubuntu/files/' + req.files.file.name, function(err) {
		if(err){
			console.log('Error uploading ' + req.files.file.name + '\nError: ' + err);
			return res.status(500).send(err);
		} 


		return res.send('File uploaded');
	});

});

module.exports = router;