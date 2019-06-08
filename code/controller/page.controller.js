var userModel = require('../models/user.model');
var companyModel;
var cvModel = require('../models/cv.model');
var jobModel = require('../models/job.model');
var jobCateModel = require('../models/jobcategory.model');
var jobController = require('../controller/job.controller');
var companyController = require('../controller/company.controller');
var userController = require('../controller/user.controller');
var ejs = require('ejs');


module.exports = {
    run: function (req, res, next, page, params) {
        switch (page) {
            case 'home':
                jobController.listFilterTable(null, function (jobFilterTable) {
                    companyController.listBigCompany(function (bigCompanyList) {
                        res.render('home', {jobFilterTable: jobFilterTable, bigCompanyList: bigCompanyList});
                    })
                });
                break;
            case 'login':
                var passport = require('passport');
                if (req.method === 'GET') {
                    res.render('login', {layout: false, err_message: res.locals.registermessage});
                }
                else if (req.method === 'POST') {

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
                }
                break;
            case 'register':
                var bcrypt = require('bcrypt');
                if (req.method === 'GET') {
                    res.render('register', {layout: false});
                }
                else if (req.method === 'POST') {
                    var saltRounds = 10;
                    var hash = bcrypt.hashSync(req.body.password, saltRounds);

                    var entity = {
                        username: req.body.username,
                        password: hash,
                        name: req.body.name,
                        email: req.body.email,
                        DOB: req.body.DOB,
                        address: req.body.address,
                        role: 'employer'
                    }

                    userModel.add(entity).then(function () {
                        res.locals.registermessage = "success";
                        res.redirect('/login');
                    })
                }
                break;
            case 'username-available':
                var username = req.query.username;
                userModel.singleByUserName(username).then(rows => {
                    if (rows.length > 0) {
                        return res.json(false);
                    }
                    return res.json(true);
                });
                break;
            case 'email-available':
                var email = req.query.email;
                userModel.singleByEmail(email).then(rows => {
                    if (rows.length > 0) {
                        return res.json(false);
                    }
                    return res.json(true);
                });
                break;
            case 'logout':
                req.logOut();
                res.redirect('/');
                break;
            case 'job-category':
                var jobcategory = params.name;
                var title = "Danh sách việc làm ";
                if (jobcategory === 'all') {
                    jobController.listFilterTable('all', function (jobFilterTable) {
                        jobModel.count().then(function (numberOfJobs) {
                            res.render('job-category', {
                                title: title,
                                numberOfJobs: numberOfJobs[0].numberOfJobs,
                                jobFilterTable: jobFilterTable
                            });
                        })

                    });
                }
                else {
                    title += jobcategory;
                    jobController.listFilterTable(jobcategory, function (jobFilterTable) {
                        jobCateModel.singleWithJobsCount(jobcategory).then(function (jobcate) {
                            if (jobcate[0] === undefined) {
                                res.render('404');
                            }
                            else {
                                res.render('job-category', {
                                    title: title,
                                    numberOfJobs: jobcate[0].numberOfJobs,
                                    jobFilterTable: jobFilterTable
                                });
                            }
                        })
                    });
                }
                break;
            case 'job-search':
                res.render('job-search');
                break;
            case 'job':
                var JID = params.jid;
                jobController.getDetails(JID, function (jobDetails, jobInfo) {
                    if (jobInfo === undefined) {
                        res.render('404');
                    }
                    else {
                        userController.getMinimalProfile(123, function (managerProfile) {
                            res.render('job', {
                                jobDetails: jobDetails,
                                companyName: jobInfo.company,
                                companyDescription: jobInfo.cdescription,
                                managerProfile: managerProfile
                            });
                        })
                    }
                });
                break;
            case 'contact':
                res.render('contact-us');
                break;
            case 'about':
                res.render('about');
                break;
            case'more':
                var click = req.body.click_more;
                var type = req.body.type;
                if (click === '1') {
                    jobController.updateFilterTable(null, type, function (job) {
                        res.send(job)
                    });
                }
                break;

        }
    }
};
