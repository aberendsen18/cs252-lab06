var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
<<<<<<< Updated upstream
  res.render('login', { title: 'Login' });
});

/* GET index page. */
router.get('/lobby', function(req, res, next) {
  res.render('lobby', { title: 'Lobby' });
});

/* GET create account page. */
router.get('/create', function(req, res, next) {
  res.render('create', { title: 'Create Account' });
=======
  res.render('game', { title: 'Express' });
>>>>>>> Stashed changes
});

router.get('/game', function(req, res, next) {
  res.render('game', {title: 'Game'});
});
module.exports = router;
