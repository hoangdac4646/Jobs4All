var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();

router.get('/account-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'account-manager');
});

router.post('/account-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'account-manager');
});

router.get('/company-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'company-manager');
});

router.post('/company-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'company-manager');
});

router.get('/job-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'job-manager');
});


router.post('/job-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'job-manager/edit');
});

router.get('/account-manager/username-available', (req, res, next) => {
    return page.validate(req, res, next, 'username-available');
});

module.exports = router;
