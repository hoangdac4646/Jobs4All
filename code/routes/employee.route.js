var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();
router.get('/my-account' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account');
});

router.all('/my-account/edit' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account/edit');
});

router.get('/my-account/edit/email-available' ,(req, res, next) => {
    page.validate(req,res,next, 'email-available');
});

router.get('/my-account/edit/verify-pass' ,(req, res, next) => {
    page.validate(req,res,next, 'verify-pass');
});

router.get('/my-cv' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-cv');
});

module.exports = router;
