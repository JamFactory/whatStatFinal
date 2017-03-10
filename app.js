var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var mongoose = require('mongoose');
var session      = require('express-session');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);   //from fiverr
var config     = require('./config/config.js');     //from fiverr
var database   = require('./config/database.js');   //from fiverr

var morgan = require ('morgan');
var flash    = require('connect-flash');

var app = express();

//connect to mongodb
mongoose.connect(database.url);  //from fiverr
var db=mongoose.connection;     //from fiverr

app.listen(config.server.port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//set session config stuff    from fiverr
app.use(session({
    secret: config.session.secret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

global.dbSettings ={
  host: 'localhost',
  user: 'root',
  password: 'a4904574',
  database:'players'
};

var connection = mysql.createConnection(global.dbSettings);

connection.connect();   // just to test sql conncection

connection.query('SELECT * from game', function (err, rows, fields) {
  if (err) throw err

    for (var i=0;i<rows.length;i++){
        console.log (rows[i].game_id +" "+rows[i].home_team_id+" "+rows[i].home_team_id+" "+rows[i].game_date)

    }
  console.log("The Game ID is "+rows[0].game_id)
})

connection.end()   //test connectionend



var index = require('./routes/index');
var users = require('./routes/users');
var main  = require('./routes/main');
var signup  = require('./routes/signup');
var login  = require('./routes/login');
var event  = require('./routes/event');
var game  = require('./routes/game');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(passport.initialize());  //from fiverr
app.use(passport.session());   //from fiverr
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use(logger('dev'));
//app.use(cookieParser());

//injecting routes
app.use('/',require('./routes/index'));     //from fiverr
app.use('/auth',require('./routes/auth'));   //from fiverr
app.use(flash());

app.all('/', function(req, res){
    req.flash('test', 'it worked');
    res.redirect('/test')
});

app.all('/test', function(req, res){
    res.send(JSON.stringify(req.flash('test')));
});



//app.use('/', index);
//app.use('/users', users);
app.use('/main', main);
//app.use('/signup', signup);
//app.use('/login', login);
app.use('/event', event);
app.use('/game', game);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
