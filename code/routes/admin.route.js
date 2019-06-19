var express = require('express');
var page = require('../controller/page.controller');

var router = express.Router();

router.get('/account-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'account-manager');
});

router.post('/account-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'account-manager/edit');
});

router.get('/company-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'company-manager');
});

router.post('/company-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'company-manager/edit');
});

router.get('/job-manager', (req, res, next) => {
    return page.runAdmin(req, res, next, 'job-manager');
});

router.post('/job-manager/edit', (req, res, next) => {
    return page.runAdmin(req, res, next, 'job-manager/edit');
});

router.get('/account-manager/edit/username-available', (req, res, next) => {
    return page.validate(req, res, next, 'admin/username-available');
});

router.get('/account-manager/edit/email-available', (req, res, next) => {
    return page.validate(req, res, next, 'admin/email-available');
});

module.exports = router;
