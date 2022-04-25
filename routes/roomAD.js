var express = require('express');
const { _router } = require('../app');
var router = express.Router();
const db = require('monk')("localhost:27017/Dormitory");

router.get('/', function(req, res, next) {
  var ct = db.get('problem');
  ct.find({}, {projection: {_id: 0, name: 1, pnum: 1, room: 1, problem: 1}})
  .then(result => {
    console.log(result)
    res.render('roomAD',{data: result});
  });
});

router.get('/addPost', function(req, res, next) {
  res.render('addPost');
});

module.exports = router;