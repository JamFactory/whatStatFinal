var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

var User     = require('../models/user');
var passport = require('passport');
var passportStrategies=require('../config/passport');
var conEnsure=require('connect-ensure-login');//midleware used to check authentication of every request

var user_id;
// GET user id
router.get('/userid',conEnsure.ensureLoggedIn("/"), function(req, res){
    if(req.user){
                user_id = req.user._id;
        res.send(user_id)

   } else res.render('error', {title:"title" ,status:"not found"});   // Dont need this else NM 8/3/17
});


router.post('/', function(req, res) {
    var p;
    console.log("0"+req.body.homeTeam,req.body.awayTeam);

    var connection = mysql.createConnection(global.dbSettings);
    connection.connect(function(err,resx) {
        if (err) {
            console.log(err);
        } else {
            console.log("connected.");

            connection.query(
                "INSERT INTO game(homeTeam,awayTeam,game_date,master_user_id) VALUES (?,?,?,?)",
                [req.body.homeTeam,req.body.awayTeam,req.body.date, req.body.userid],
                     function (err, results) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log("1. Hi Paul next stop game_id...") ;
                            console.log("2.Game Created with Game_ID:"+results.insertId);
                            console.log( "3. "+req.body.homeTeam,req.body.awayTeam,req.body.date,req.body.userid);
                        }
                        res.send(200,results.insertId)
                    });


                connection.end(function (err) {

                    if (err) {
                        console.log("The connection could not be closed.");
                    } else {
                        console.log("The connection is closed.");
                    }
                });
        }


    });

  //  console.log(Object.keys(req));
  //  console.log(Object.keys(res));
    //console.log(Object.keys(game_id));
   //res.json(game_id);
    //res.send("Paul");
    console.log("4: About to send");
  // res.end();
});


/* router.post('/teamEvent', function(req, res) {
    var game_id ={};
    console.log(req.body.homeTeam,req.body.awayTeam);


    var connection = mysql.createConnection(global.dbSettings);
    connection.connect(function(err,res) {


        if (err) {
            console.log(err);
        } else {
            console.log("connected.");

            connection.query(
                "INSERT INTO game(homeTeam,awayTeam,game_date) VALUES (?,?,?)",
                [req.body.homeTeam,req.body.awayTeam,req.body.date],

                function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Game Created with Game_ID:"+results.insertId);
                        console.log(req.body.homeTeam,req.body.awayTeam,req.body.date);

                    }

                });

            connection.end(function (err) {
                if (err) {
                    console.log("The connection could not be closed.");
                } else {
                    console.log("The connection is closed.");
                }
            });
        }
    });
    res.end();
});
*/


module.exports = router;