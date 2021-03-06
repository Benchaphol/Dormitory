var express = require('express');
const { check, validationResult } = require('express-validator');
require('dotenv').config();
const { ObjectID } = require('mongodb');
var router = express.Router();
const db = require('monk')(process.env.mongo_url || "localhost:27017/admin");

router.get('/', function(req, res, next) {
  var ct = db.get('problem');
  ct.find({}, {projection: {_id: 1, stid:1, name: 1, pnum: 1, room: 1, problem: 1}})
  .then(result => {
    console.log(result)
    res.render('roomAD',{data: result});
  });
});

router.get('/addPost', function(req, res, next) {
  res.render('addPost');
});

router.post('/addPost', [
  check("title" , "กรุณาป้อนชื่อเรื่อง").not().isEmpty(),
  check("author" , "กรุณาป้อนชื่อผู้เขียน").not().isEmpty(),
  check("content" , "กรุณาป้อนเนื้อหา").not().isEmpty()
], function(req, res, next) {
  const result = validationResult(req);
    var errors = result.errors;
    if (!result.isEmpty()) {
        res.render('addPost' , {errors : errors});
    }
    else{
        //insert data to DB
        var collection = db.get('announce');
        //console.log("Insert");
        collection.insert({
            title:req.body.title,
            author:req.body.author,
            content:req.body.content
        } , function(err , data){
            console.log(data)
            if(err){
              res.send(err);
            }
            else{
              console.log("save");
              res.location('/roomAdmin');
              res.redirect('/roomAdmin');
            }
        });
    }
});

router.get('/manage', function(req, res, next) {
  var ct = db.get('announce');
  ct.find({}, {projection: {_id: 0, title: 1, author: 1, content: 1}})
  .then(result => {
    //console.log(result)
    res.render('announce',{data: result});
  });
});

router.post('/manage(:title)', function(req, res, next) {
  var ct = db.get('announce');
  ct.findOneAndDelete({title: req.params.title}).then((doc) => {
    res.location('/roomAdmin/manage');
    res.redirect('/roomAdmin/manage');
  });
});

router.get('/dataManage', function(req, res, next) {
  var ct = db.get('problem');
  ct.find({}, {projection: {_id: 1, stid:1, name: 1, pnum: 1, room: 1, problem: 1}})
  .then(result => {
    //console.log(result)
    res.render('problemManage',{data: result});
  });
});

router.post('/dataManage(:_id)', function(req, res, next) {
  var ct = db.get('problem');
  ct.findOneAndDelete({_id: req.params._id}).then((doc) => {
    res.location('/roomAdmin');
    res.redirect('/roomAdmin');
  })
})

module.exports = router;