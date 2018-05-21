var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
  //res.redirect('/catalog');
  //return res.sendFile('../views/index.html');
});

//POST route for updating data
router.post('/', (req, res, next) => {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/testpage');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password. error = ' + error);
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/catalog');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})



module.exports = router;
