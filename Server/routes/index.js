var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'AAM | Index' });
});

/* this is a hack, change this */
/* hitting the submit button on the index peforms action /results via
	POST, but doesn't send any data currently. This is a quick hack for
	testing purposes
 */
router.post('/results', function(req, res, next) {
  res.render('results', { title: 'AAM | Results' });
});


module.exports = router;
