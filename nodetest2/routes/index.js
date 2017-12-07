var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

/* GET lobby page. */
router.get('/lobby', function(req, res, next) {
  res.render('lobby', { title: 'Lobby' });
});

/* GET create account page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create Account' });
});

/* GET game page. */
router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Play the Game' });
});

/* GET game page. */
router.get('/gameover', function(req, res, next) {
  res.render('gameover', { title: 'Game Over' });
});

module.exports = router;
