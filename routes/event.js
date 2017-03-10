/**
 * Created by neil on 23/08/14.
 */
/**
 * Created by neil on 23/08/14.
 */
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/list', function (req, res) {                       //TODO add paramter for game_id etc.

    var connection = mysql.createConnection(global.dbSettings);
    connection.connect(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("connected.");

            connection.query(
                "SELECT * FROM event",
                function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("got events from db");
                        console.log(results);

                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(results));
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

});



router.post('/', function(req, res) {
    console.log('hi Neil im in the event');

    console.log(req.body.game_id,req.body.event,req.body.playerNumber,req.body.eventTime,req.body.team);

    var connection = mysql.createConnection(global.dbSettings);
    connection.connect(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("connected.");


            connection.query(
                "INSERT INTO event(game_id,event,player_no,time,team) VALUES (?,?,?,?,?)",
                [req.body.game_id,req.body.event,req.body.playerNumber,req.body.eventTime,req.body.team],
                function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("event added");
                        console.log(req.body.game_id,req.body.event,req.body.playerNumber,req.body.eventTime,req.body.team)
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



router.post('/teamEvent', function(req, res) {
    //console.log('hi Neil');

    console.log(req.body.game_id,req.body.statEvent,req.body.putInBy,req.body.wonBy,req.body.teamEventOutcome, req.body.pitchzone,req.body.eventTime);

    var connection = mysql.createConnection(global.dbSettings);
    connection.connect(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("connected.");

                // Using a single table here called 'Scrum' but lineouts and scrums are recorded in it. NM 8/3/17
            connection.query(
                "INSERT INTO scrum(game_id,statEvent,putInBy,wonBy,teamEventOutcome,pitchzone,eventTime) VALUES (?,?,?,?,?,?,?)",
                [req.body.game_id,req.body.statEvent,req.body.putInBy,req.body.wonBy,req.body.teamEventOutcome, req.body.pitchzone,req.body.eventTime],
                function (err, results) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("event added");
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





router.get('/test', function(req, res) {
    res.send("test");


});


module.exports = router;
