'use strict';

var passport = require('passport'),
    TwitterTokenStrategy = require('passport-twitter-token'),
    User = require('mongoose').model('User'),
    twitterConfig = require('./twitter.config.js');

// Twitter strategy implementation
module.exports = () => {
console.log(twitterConfig);
    passport.use(new TwitterTokenStrategy({
        consumerKey: twitterConfig.consumerKey,
        consumerSecret: twitterConfig.consumerSecret,
        includeEmail: true
    },
        (token, tokenSecret, profile, done) => {
            User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
                return done(err, user);
            });
        }));

};