var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();

router.get('/dashboard' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'dashboard');
});

router.get('/dashboard/my-account' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account');
});

router.all('/dashboard/my-account/edit' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-account/edit');
});

router.get('/dashboard/my-account/edit/email-available' ,(req, res, next) => {
    page.validate(req,res,next, 'email-available');
});

router.get('/dashboard/my-account/edit/verify-pass' ,(req, res, next) => {
    page.validate(req,res,next, 'verify-pass');
});

router.get('/dashboard/employee/my-cv' ,(req, res, next) => {
    page.runEmployee(req,res,next, 'my-cv');
});

module.exports = router;
