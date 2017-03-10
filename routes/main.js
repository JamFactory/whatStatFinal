/**
 * Created by MitchellN on 06/12/2016.
 */


var express = require('express');
var router = express.Router();

/* GET Main page.*/
router.get('/', function(req, res, next) {
    res.render('main', { title: 'WhatStat' });
});


router.get('/', function(req, res, next) {
    res.send("Your on the main");
});


module.exports = router;
