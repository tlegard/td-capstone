'use strict';

import User from './models/User';
import './App.css';
import TrendingContainer from './components/TrendingContainer';

import React, { Component } from 'react';
import Express from 'express';
import Session from 'express-session';
import Path from 'path';
// const User = require('mongoose').model('User'); something to consider
import BodyParser from 'body-parser';
import ExpressJwt from 'express-jwt';
import Jwt from 'jsonwebtoken';
import Passport from 'passport';
import TwitterTokenStrategy from 'passport-twitter-token';
import Cors from 'cors';
import { request } from 'http';

const app = Express();
const router = Express.Router();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: false }));
app.use(Express.static(Path.join(__dirname, 'public')));

// refactor below into own files

// Twitter strategy implementation
module.exports = () => {
    Passport.use(new TwitterTokenStrategy({
        consumerKey: 'KEY',
        consumerSecret: 'SECRET',
        includeEmail: true
    },
        (token, tokenSecret, profile, done) => {
            User.upsertTwitterUser(token, tokenSecret, profile, (err, user) => {
                return done(err, user);
            });
        }));
}

// Handle token
const createToken = (auth) => {
    return Jwt.sign({
        id: auth.id
    }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

const generateToken = (req, res, next) => {
    req.token = createToken(req.auth);
    return next();
};

const sendToken = (req, res) => {
    res.setHeader('x-auth-token', req.token);
    return res.status(200).send(JSON.stringify(req.user));
};

// handle validation using express-jwt
const authenticate = ExpressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

// authentication
// obtain request token
router.route('/auth/twitter/reverse')
    .post((req, res) => {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
                consumer_key: 'KEY',
                consumer_secret: 'SECRET'
            }
        }, (err, r, body) => {
            if (err) {
                return res.send(500, { message: err.message });
            }

            const jsonString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            res.send(JSON.parse(jsonString));
        });
    });

// authorization
// obtain oauth verifier
router.route('auth/twitter')
    .post((req, res, next) => {
        request.post({
            url: `https://api.twitter.com/oauth/acces_token?oauth_verifier`,
            oauth: {
                consumer_key: 'KEY',
                consumer_secret: 'SECRET',
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        }, (err, r, body) => {
            if (err) {
                return res.send(500, { message: err.message });
            }

            console.log(body);
            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            const parsedBody = JSON.parse(bodyString);

            req.body['oauth-token'] = parsedBody.oauth_token;
            req.body['oauth-token-secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;

            next();
        });
    }, Passport.authenticate('twitter-token', { Session: false }), (req, res, next) => {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        // capture token for API
        req.auth = {
            id: req.user.id
        };

        return next();
    }, generateToken, sendToken);

// cors
const corsConfig = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposeHeaders: ['x-auth-token']
};
app.use(Cors(corsConfig));


export default class App extends Component {

    render() {
        return (
            <div className="App">
                <header>Trending Hashtags</header>
                <button>Sign in with Twitter</button>
                <TrendingContainer />
            </div>
        );
    }

}