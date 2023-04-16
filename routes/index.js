var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about-us', function(req, res, next) {
  res.render('about-us');
});

module.exports = router;
