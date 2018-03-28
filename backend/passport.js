'use strict';

const passport = require('passport'),
    TwitterTokenStrategy = require('passport-twitter-token'),
    User = require('mongoose').model('User'),
    twitterConfig = require('./twitter.config.js');

// Twitter strategy implementation
module.exports = () => {

    passport.use(new TwitterTokenStrategy({
        consumerKey: 'KEY',
        consumerSecret: 'SECRET',
        includeEmail: true
    },
        (token, tokenSecret, profile, done) => {
            User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
                return done(err, user);
            });
        }));

};