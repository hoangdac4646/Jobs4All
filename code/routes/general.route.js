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
    return page.run(req,res,next, 'username-available');
});

router.get('/register/email-available', (req, res, next) => {
    return page.run(req,res,next, 'email-available');
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
    res.redirect('/job-category/all');
});

router.get('/job-category/:name', (req, res, next) => {
    var name = req.params.name;
    page.run(req,res,next,'job-category',{name:name});
});

router.get('/job-search', (req, res, next) => {
    page.run(req,res,next, 'job-search');
});

router.get('/company/:name', (req, res, next) => {
    var name = req.params.name;
    page.run(req,res,next, 'job-company',{name:name});
});

router.get('/profile/:uid', (req, res, next) => {
    var uid = req.params.uid;
    page.run(req,res,next, 'profile',{uid:uid});
});

router.get('/profile/:uid/cv/:cvid', (req, res, next) => {
    var uid = req.params.uid;
    var cvid = req.params.cvid;

    page.run(req,res,next, 'cv',{uid: uid, cvid: cvid});
});

router.get('/contact', (req, res, next) => {
    page.run(req,res,next, 'contact');
});

router.get('/about', (req, res, next) => {
    page.run(req,res,next, 'about');
});

router.get('/about', (req, res, next) => {
    page.run(req,res,next, 'about');
});

router.post('/more', (req, res, next) => {
    page.run(req,res,next, 'more');
});


router.use((req, res, next) => {
    res.render('404');
})

router.use((error, req, res, next) => {
    res.render('error', {
        message: error.message,
        error
    })
})

module.exports = router;
