/**
 * Created by MitchellN on 07/12/2016.
 */


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', { title: 'Test' });
});

module.exports = router;
