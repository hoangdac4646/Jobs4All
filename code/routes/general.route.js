var express = require('express');
var page = require('../controller/page.controller');
var auth = require('../middlewares/auth');

var router = express.Router();

router.get('/', (req, res, next) => {
    page.run(req,res,next, 'home');
});

router.all('/login', (req, res, next) => {
    page.run(req,res,next, 'login');
});

router.all('/register', (req, res, next) => {
    page.run(req,res,next, 'register');
});

router.get('/register/username-available', (req, res, next) => {
    return page.validate(req,res,next, 'username-available');
});

router.get('/register/email-available', (req, res, next) => {
    return page.validate(req,res,next, 'email-available');
});

router.post('/logout', auth, (req, res, next) => {
    page.run(req,res,next, 'logout');
});

router.get('/job', (req, res, next) => {
    res.redirect('/job-category/all');
});

router.get('/job/:jid', (req, res, next) => {
    var jid = req.params.jid;
    page.run(req,res,next,'job', {jid:jid});
});

router.get('/job-category', (req, res, next) => {
    return res.redirect('/job-category/all');
});

router.get('/job-category/:name', (req, res, next) => {
    var name = req.params.name;
    page.run(req,res,next,'job-category',{name:name});
});

router.all('/job-search', (req, res, next) => {
    page.run(req,res,next, 'job-search');
});

router.get('/company', (req, res, next) => {
    if (res.locals.isAuthenticated) return res.redirect('/my-company');
    return res.redirect('/');
});

router.get('/company/:cid', (req, res, next) => {
    var CID = req.params.cid;
    if (res.locals.isAuthenticated) {
        if (parseInt(CID) === res.locals.authUser.CID) return res.redirect('/my-company');
    }
    page.run(req,res,next, 'company',{CID:CID});
});

router.get('/profile', (req, res, next) => {
    if (res.locals.isAuthenticated) return res.redirect('/my-account');
    return res.redirect('/');
});

router.get('/profile/:uid', (req, res, next) => {
    var UID = req.params.uid;
    if (res.locals.isAuthenticated) {
        if (parseInt(UID) === res.locals.authUser.UID) return res.redirect('/my-account');
    }
    page.run(req,res,next, 'profile',{UID:UID});
});

router.get('/profile/:uid/cv', (req, res, next) => {
    return res.redirect('/profile/:uid');
});

router.get('/profile/:uid/cv/:cvid', (req, res, next) => {
    var UID = req.params.uid;
    var CVID = req.params.cvid;
    page.run(req,res,next, 'cv',{UID: UID, CVID: CVID});
});

router.get('/contact', (req, res, next) => {
    page.run(req,res,next, 'contact');
});

router.get('/about', (req, res, next) => {
    page.run(req,res,next, 'about');
});

router.post('/more-jobs', (req, res, next) => {
    page.run(req,res,next, 'more-jobs');
});

module.exports = router;
