'use strict';

import Mongoose from 'mongoose';
import TwitterTokenStrategy from 'passport-twitter-token';
import Session from 'express-session';

// mongodb connection
Mongoose.connect('mongodb://localhost:3000/');
const db = Mongoose.connection;

// mongo error
db.on('error', console.error.bind(console, 'connection error:'));

const MongoStore = require('connect-mongo')(Session);

const UserSchema = new Mongoose.Schema({
    email: {
        type: String, required: true,
        trim: true, unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    },
    twitterProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

UserSchema.statics.upsertTwitterUser = (token, tokenSecret, profile, cb) => {
    return this.findOne({
        'twitterProvider.id': profile.id
    }, (err, user) => {
        // if no user found, create one
        if (!user) {
            let newUser = new this({
                email: profile.emails[0].value,
                twitterProvider: {
                    id: profile.id,
                    token: token,
                    tokenSecret: tokenSecret
                }
            });

            newUser.save((error, savedUser) => {
                if (error) {
                    console.log(error);
                }
                return cb(error, savedUser);
            });

        } else {
            return cb(err, user);
        }
    });
};

const User = Mongoose.model('User', UserSchema);

export default User;