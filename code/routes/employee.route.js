var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();

router.get('/' ,(req, res, next) => {
    res.redirect("/dashboard/my-account")
});

router.get('/my-account' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account');
});

router.post('/my-account/edit' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account/edit');
});

router.get('/employee/my-cv' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-cv');
});

router.post('/employee/my-cv/edit' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-cv/edit');
});

router.get('/my-account/edit/email-available' ,(req, res, next) => {
    page.validate(req,res,next, 'email-available');
});

router.get('/my-account/edit/verify-pass' ,(req, res, next) => {
    page.validate(req,res,next, 'verify-pass');
});

router.all('/send-email' ,(req, res, next) => {
    var JID = null;
    page.runEmployee(req,res,next, 'send-email',{JID:JID});
});

router.all('/send-email/:JID' ,(req, res, next) => {
    var JID = req.params.JID;
    page.runEmployee(req,res,next, 'send-email',{JID:JID});
});


module.exports = router;
