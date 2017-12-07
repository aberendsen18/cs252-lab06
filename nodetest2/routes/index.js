var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET lobby page. */
router.get('/lobby', function(req, res, next) {
  console.log(req.cookies.user);
  res.render('lobby', { title: 'Lobby', user: req.cookies.user});
});

/* GET create account page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create Account' });
});

/* GET game page. */
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Play the Game' });
});

module.exports = router;
