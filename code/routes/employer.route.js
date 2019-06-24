var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();
router.get('/my-company' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'my-company');
});

router.post('/my-company/edit' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'my-company/edit');
});

router.get('/my-company/edit/verify-pass' ,(req, res, next) => {
    page.validate(req,res,next, 'verify-pass');
});

router.get('/job-manager' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'job-manager');
});

router.post('/job-manager/edit' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'job-manager/edit');
});

router.get('/applicant-manager' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'applicant-manager');
});

router.post('/applicant-manager/edit' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'applicant-manager/edit');
});

module.exports = router;
