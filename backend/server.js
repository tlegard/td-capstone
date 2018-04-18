'use strict';

var mongoose = require('./mongoose'),
    express = require('express'),
    router = express.Router(),
    bodyParser = require('body-parser'),
    request = require('request')

mongoose();

var User = require('mongoose').model('User');

const app = express();

// rest API
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.route('/health-check').get((req, res) => {
    res.status(200);
    res.send('Successful connection');
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

app.use('/api/v1', router);

app.listen(8080);

console.log('Server running on port 8080!');

module.exports = app;