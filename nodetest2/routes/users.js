var express = require('express');
var router = express.Router();

/*
 * GET userlist (userlist).
 */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to adduser (userlist).
 */
router.post('/adduser', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteuser (userlist).
 */
router.delete('/deleteuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('userlist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * DELETE to deleteuserlobby (lobby).
 */
router.delete('/deletelobbyuser/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('lobbylist');
    var userToDelete = req.params.id;
    collection.remove({ '_id' : userToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});

/*
 * GET lobbylist (lobby).
 */
router.get('/lobbylist', function(req, res) {
    var db = req.db;
    var collection = db.get('lobbylist');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addlobbyuser (lobby).
 */
router.post('/addlobbyuser', function(req, res) {
    var db = req.db;
    var collection = db.get('lobbylist');
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

module.exports = router;
