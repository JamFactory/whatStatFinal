var express  = require('express');
var router   = express.Router();
var crypto   = require('crypto');
var async    = require('async');
var config   = require('../config/config');
var User     = require('../models/user');
var passport = require('passport');
var passportStrategies=require('../config/passport');
var conEnsure=require('connect-ensure-login');//midleware used to check authentication of every request

//setting up passport configuration

passportStrategies(passport);

//GET /login
router.get('/login',conEnsure.ensureLoggedOut("/") ,function(req, res){
  res.render('login', { title: 'Sign In'})
});

//POST /login
router.post('/login',passport.authenticate('local',{ failureRedirect: '/' }), function(req, res){
  res.redirect("/profile");  //changed by NM 9/12/16 from 'profile' to 'main'. TODO get pic / user from profile and use in main
});

// GET /sign_up
router.get('/sign_up',conEnsure.ensureLoggedOut('/'),function(req, res){
  res.render('sign_up', {title: 'Signup'});
});


//POST /sign_up
router.post('/sign_up', passport.authenticate('local-signup', {
  successRedirect : '/profile', // redirect to the secure profile section
  failureRedirect : '/sign_up' // redirect back to the signup page if there is an error
}));

//GET /logout
router.get('/logout', conEnsure.ensureLoggedIn("/login"), function(req, res){
  req.logout();
  res.redirect('/');
});


// GET /home
router.get('/profile',conEnsure.ensureLoggedIn("/"), function(req, res){
    if(req.user){
      var email=req.user.local.email || req.user.facebook.email || req.user.google.email ;
      var dbUser = {
        _id: req.user._id,
        email      : req.user.local.email || req.user.facebook.email || req.user.google.email,
        displayName: req.user.facebook.displayName, name: req.user.facebook.name,
        pictureUrl : req.user.pictureUrl  || "/images/unknown-user.png"
      };
      res.render('profile', {title: 'Profile',user:dbUser});
    } else res.render('error', {title:"title" ,status:"not found"});
});


/* GET home page. */

router.get('/',conEnsure.ensureLoggedOut("/profile"),function(req, res) {
  return res.render('index', { title: 'Index'});
});


module.exports = router;
