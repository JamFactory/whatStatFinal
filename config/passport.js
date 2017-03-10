var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var crypto   =require('crypto');
var configAuth = require('../config/authCfg');
var User   = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    //implement local sign up strategy
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {
            console.log("inside registration callback");
            // make the code asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {

                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                User.findOne({ 'local.email' :  email }, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // check to see if theres already a user with that email
                    if (user) {
                        return done(null, false, {message:"That email is already taken."});
                    } else {

                        // if there is no user with that email
                        // create the user
                        var newUser            = new User();

                        // set the user's local credentials
                        newUser.displayName           = req.body.displayName;
                        newUser.local.email           = email;
                        newUser.local.password        = newUser.generateHash(password);
                        newUser.local.activated       = false;
                        newUser.local.activationToken = crypto.randomBytes(20).toString('hex');
                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log(JSON.stringify(err));
                                throw err;
                            }else {
                                return done(null, newUser);
                            }
                        });
                    }
                });

            });

        }));

//implement local-strategy "log in" (login/password)
    passport.use(new LocalStrategy({
            usernameField     : 'email',  //I used email as username
            passwordField     : 'password',
            passReqToCallback : true
        },
        function(req,email,password,done){
            User.findOne({'local.email': email}, function(err, user){
                if (err) { return done(err);}
                else if (!user)
                    return done(null, false, {message: 'Incorrect email.'});
                else if(req.resetPass)
                    return done(null,user);
                else if	(!user.validPassword(password))
                    return done(null, false, {message: 'Incorrect password.'});
                else{
                    return done(null,user);
                }
            });
        }));

//google oauth strategie

    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL,

        },
        function(token, refreshToken, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function() {

                // try to find the user based on their google id
                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        user.displayName  = profile.displayName;
                        user.google.name  = profile.displayName;
                        user.google.email = profile.emails[0].value; // pull the first email
                        user.pictureUrl   = profile._json['image'].url;
                        // save the user
                        user.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, user);
                        });
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser          = new User();

                        // set all of the relevant information
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        newUser.pictureUrl   = profile._json['image'].url;
                        newUser.displayName  = profile.displayName;
                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));


    //set up facebook strategy
    passport.use(new FacebookStrategy({
            // pull in our app id and secret from our auth.js file
            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileFields   : ['id', 'emails', 'name','picture.type(small)']  // type   enum{small, normal, album, large, square}

        },

        // facebook will send back the token and profile
        function(token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                        user.pictureUrl=profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';
                        user.displayName  = profile.displayName;
                        // save our user to the database
                        user.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, user);

                        });
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newUser            = new User();

                        // set all of the facebook information in our user model
                        newUser.facebook.id    = profile.id; // set the users facebook id
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user
                        newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.facebook.displayName    = profile.displayName;
                       // newUser.pictureUrl=profile.photos ? profile.photos[0].value : '/img/faces/unknown-user-pic.jpg';  // NM  Changed to line below 7/3/17
                        newUser.pictureUrl=profile.photos ? profile.photos[0].value : '/images/unknown-user-pic.jpg';

                        // save our user to the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));
    //serialize user into session store (database in our case)
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user => req.user is populated
    // user session data can be found in req.user object :(req.user.email ,req.user.password ....etc)
    passport.deserializeUser(function(id, done) {
        User.findById(id,'id local.email facebook.email google.email pictureUrl facebook.name',function(err, user) {
            done(err, user);
        });
    });

}
