var express = require('express');
var router = express.Router();
require('dotenv').config();
const { check, validationResult } = require('express-validator');
const db = require('monk')(process.env.mongo_url || "localhost:27017/admin");

router.get('/', function(req, res, next) {
  var ct = db.get('announce');
  ct.find({}, {projection: {_id: 0, title: 1, author: 1, content: 1}})
  .then(result => {
    console.log(result)
    res.render('roomSTD',{data: result});
  });
});

router.get('/report', function(req, res, next) {
  res.render("reportproblem");
});

router.post('/report', [
  check("stdid" , "กรุณาป้อนรหัสนักศึกษา").not().isEmpty(),
  check("name" , "กรุณาป้อนชื่อ-นามสกุล").not().isEmpty(),
  check("room" , "กรุณาป้อนหมายเลขห้อง").not().isEmpty(),
  check("pnum" , "กรุณาป้อนเบอร์โทร").not().isEmpty(),
  check("problem" , "กรุณาปัญหารายละเอียด").not().isEmpty()
],function(req, res, next) {
  const result = validationResult(req);
  var errors = result.errors;
  if (!result.isEmpty()) {
      res.render('reportproblem' , {errors : errors});
  }
  else{
      //insert data to DB
      var collection = db.get('problem');
      collection.insert({
          stid:req.body.stdid,
          name:req.body.name,
          pnum:req.body.pnum,
          room:req.body.room,
          problem:req.body.problem

      } , function(err , data){
          console.log(data)
          if(err){
              res.send(err);
          }
          else{
              console.log("save");
              res.location('/roomStudent');
              res.redirect('/roomStudent');

          }
      });
  }
});

module.exports = router;