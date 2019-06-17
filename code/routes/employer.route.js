var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();
router.get('/dashboard/employer/my-company' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'my-company');
});

router.all('/dashboard/employer/my-company/edit' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'my-company/edit');
});

router.get('/dashboard/employer/my-company/edit/verify-pass' ,(req, res, next) => {
    page.validate(req,res,next, 'verify-pass');
});

router.get('/dashboard/employer/job-manager' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'job-manager');
});

router.get('/dashboard/employer/applicant-manager' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'applicant-manager');
});

router.post('/dashboard/employer/job-manager/edit' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'job-manager/edit');
});

router.post('/dashboard/employer/applicant-manager/update' ,(req, res, next) => {
    page.runEmployer(req,res,next, 'applicant-manager/update');
});

module.exports = router;
