var express = require('express');
var router = express.Router();
var User   = require('../models/user');
var configAuth = require('../config/authCfg');
var passport = require('passport'),
    passportStrategies=require('../config/passport'),
    conEnsure=require('connect-ensure-login');

//apply defined passport
passportStrategies(passport);
//GET /auth/facebook

router.get('/facebook', passport.authenticate('facebook', { scope : ['email'] }));

// handle the callback after facebook has authenticated the user
router.get('/facebook/return',
    passport.authenticate('facebook', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));


router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.get('/google/return',
    passport.authenticate('google', {
        successRedirect : '/',
        failureRedirect : '/login'
    }));

router.get('/logout',conEnsure.ensureLoggedIn("/login"),function(req,res){
    req.logout();
    req.redirect('/login');
});
module.exports = router;
