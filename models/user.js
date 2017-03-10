'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({

    local            : {
        email            : {type: String,trim: true},
        password         : {type: String}
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },

    displayName: {
        type: String,
        trim: true
    },
    pictureUrl: {
        type: String,
        trim: true
    }
});



//hash password
var salt=bcrypt.genSaltSync(10);
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, salt, null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

var User = mongoose.model('User', UserSchema);
module.exports = User;