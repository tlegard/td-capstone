'use strict';

var mongoose = require('./mongoose'),
    passport = require('passport'),
    express = require('express'),
    jwt = require('jsonwebtoken'),
    expressJwt = require('express-jwt'),
    router = express.Router(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    request = require('request'),
    twitterConfig = require('./twitter.config.js'),
    dotEnv = require('dotenv').config();

mongoose();

var User = require('mongoose').model('User');
var passportConfig = require('./passport');

// set up config for Twitter authentication
passportConfig();

const app = express();

// enable CORS
const corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// rest API
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.route('/health-check').get((req, res) => {
    res.status(200);
    res.send('Successful connection');
});

const createToken = (auth) => {
    return jwt.sign({
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

// authentication
// obtain request token
router.route('/auth/twitter/reverse')
    .post((req, res) => {
        request.post({
            url: 'https://api.twitter.com/oauth/request_token',
            oauth: {
                oauth_callback: "http%3A%2F%2Flocalhost%3A3000%2Ftwitter-callback",
                consumer_key: twitterConfig.consumerKey,
                consumer_secret: twitterConfig.consumerSecret
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
router.route('/auth/twitter')
    .post((req, res, next) => {
        request.post({
            url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
            oauth: {
                consumer_key: twitterConfig.consumerKey,
                consumer_secret: twitterConfig.consumerSecret,
                token: req.query.oauth_token
            },
            form: { oauth_verifier: req.query.oauth_verifier }
        }, (err, r, body) => {
            if (err) {
                return res.send(500, { message: err.message });
            }

            console.log('TWITTER BODY:', body);
            const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
            console.log('JSON BODY', bodyString);
            const parsedBody = JSON.parse(bodyString);
            console.log('parsed...', parsedBody);

            req.body['oauth_token'] = parsedBody.oauth_token;
            req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
            req.body['user_id'] = parsedBody.user_id;

            console.log(req.body);

            next();
        });
    }, passport.authenticate('twitter-token', { session: false }), function(req, res, next) {
        if (!req.user) {
            return res.send(401, 'User Not Authenticated');
        }

        // capture token for API
        req.auth = {
            id: req.user.id
        };

        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

        return next();
    }, generateToken, sendToken);

// token middleware
// handle validation using express-jwt
const authenticate = expressJwt({
    secret: 'my-secret',
    requestProperty: 'auth',
    getToken: (req) => {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

const getCurrentUser = (req, res, next) => {
    User.findById(req.auth.id, function (err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

const getOneUser = (req, res) => {
    let user = req.user.toObject();

    delete user['twitterProvider'];
    delete user['__v'];

    res.json(user);
};

router.route('/auth/me')
    .get(authenticate, getCurrentUser, getOneUser);

app.use('/api/v1', router);

app.listen(8080);

console.log('Server running on port 8080!');

module.exports = app;