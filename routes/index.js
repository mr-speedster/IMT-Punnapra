var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/about-us', function(req, res, next) {
  res.render('about-us');
});

router.get('/admission', function(req, res, next) {
  res.render('admission');
});

router.get('/our-course', function(req, res, next) {
  res.render('our-course');
});

router.get('/facilities', function(req, res, next) {
  res.render('facilities');
});

router.get('/faculty', function(req, res, next) {
  res.render('faculty');
});

router.get('/contact-us', function(req, res, next) {
  res.render('contact-us',);
});

module.exports = router;
