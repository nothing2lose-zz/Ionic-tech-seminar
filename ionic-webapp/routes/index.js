var express = require('express');
var router = express.Router();

var roomCtrler = require('../controllers/room');
var categoryCtrler = require('../controllers/category');

var Room = require('../models/rooms');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index');
});

// route categories
router.get('/api/categories', function (req, res) {
    categoryCtrler.allCategories(function (err, results) {
        if (null === err) {
            res.status(200).send(JSON.stringify(results));
        } else {
            res.status(500).send(err.message);
        }
    })
});

// route rooms
router.get('/api/rooms', function (req, res) {
    var startAt      = req.query.start_at;
    var limit        = req.query.limit;
    var categoryType = req.query.category_type;
    if (categoryType === undefined || 0  == categoryType) {
        categoryType = undefined;
    }
    roomCtrler.allRoomsByCategoryType(categoryType, startAt, limit, function (err, results) {
        if (null === err) {
            res.status(200).send(JSON.stringify(results));
        } else {
            res.status(500).send(err.message);
        }
    });
});

router.post('/api/rooms', function (req, res) {
    var name = req.body.name;
    var url = req.body.url;
    var categoryType = req.body.category_type;
    var authorId = req.body.author_id;
    roomCtrler.createRoom(name, url, categoryType, authorId, function (err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(JSON.stringify(result));
        }
    });
});

router.delete('/api/rooms/:id', function (req, res) {
    var id = req.params.id;
    roomCtrler.removeRoom(id, function(err, result) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(JSON.stringify(result));
        }
    });
});


// TODO?
router.get('/oauth', function (req, res, next) {
    console.log("======= called!");
    res.send(200);
});

router.post('/oauth', function (req, res, next) {
    console.log("======= called!");
    res.send(200);
});


module.exports = router;
