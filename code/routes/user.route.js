var express = require('express');
var passport = require('passport');
var bcrypt = require('bcrypt');
var model = require('../models/user.model');
var auth = require('../middlewares/auth');


var router = express.Router();

router.get('/login', function(req, res, next) {
    res.render('login', {layout: false, err_message: null});
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            return res.render('login', {
                layout: false,
                err_message: info.message
            })
        }

        req.logIn(user, err => {
            if (err)
                return next(err);
            req.user = user;
            return res.redirect('/');
        });
    })(req, res, next);
});

router.get('/register', (req, res, next) => {
    res.render('register', {layout: false});
});

router.post('/register', (req, res, next) => {
    var saltRounds = 10;
    var hash = bcrypt.hashSync(req.body.password, saltRounds);

    var entity = {
        username: req.body.username,
        password: hash,
        name: req.body.name,
        email: req.body.email,
        DOB: req.body.DOB,
        address: req.body.address,
        role: 'admin'
    }

    model.add(entity).then(function ()
    {
        res.redirect('/login');
    })
});

router.get('/register/email-available', (req, res, next) => {
    var email = req.query.email;
    model.singleByEmail(email).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
});

router.get('/register/username-available', (req, res, next) => {
    var username = req.query.username;
    model.singleByUserName(username).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
});

router.post('/logout', auth, (req, res, next) => {
    req.logOut();
    res.redirect('/');
});

module.exports = router;

