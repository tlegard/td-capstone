'use strict';

const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

module.exports = () => {

    const db = mongoose.connect('mongodb://localhost:27017/twitter-demo');

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

    UserSchema.set('toJSON', { getters: true, virtuals: true });

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

    mongoose.model('User', UserSchema);

    return db;
};