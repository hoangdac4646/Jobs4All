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
                        username: req.body.username.toLowerCase(),
                        password: hash,
                        name: req.body.name.toLowerCase(),
                        email: req.body.email.toLowerCase(),
                        DOB: req.body.DOB,
                        address: req.body.address.toLowerCase(),
                        role: 'employee'
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
                var jobCateName = params.name;
                var title = "Danh sách việc làm ";
                req.session.recentPos = 0;
                if (jobCateName === 'all') {
                    req.session.recentJCID = jobCateName;
                    jobController.listFilterTable(jobCateName, function (jobFilterTable) {
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
                    jobCateModel.singleWithJobsCount(jobCateName).then(function (jobCate) {
                        var JCID = jobCate[0].JCID;
                        req.session.recentJCID = JCID;
                        title += jobCateName;
                        jobController.listFilterTable(JCID, function (jobFilterTable) {
                            if (jobCate[0] === undefined) {
                                res.render('404');
                            }
                            else {
                                res.render('job-category', {
                                    title: title,
                                    numberOfJobs: jobCate[0].numberOfJobs,
                                    jobFilterTable: jobFilterTable
                                });
                            }
                        });
                    })
                }
                break;
            case 'job-search':
                req.session.recentPos = 0;
                if (req.method === 'GET') {
                    jobController.listSearchTable(null, null, null, null, function (searchTable) {
                        jobModel.count().then(function (numberOfJobs) {
                            res.render('job-search', {
                                numberOfJobs: numberOfJobs[0].numberOfJobs,
                                JCID: "all",
                                jobcategory: "all",
                                type: "all",
                                level: "all",
                                keyword: "",
                                searchTable: searchTable
                            });
                        })
                    });
                }
                else if (req.method === 'POST') {
                    var JCID = req.body.jobcategory,
                        type = req.body.type,
                        level = req.body.level,
                        keyword = req.body.keyword;
                    if (JCID === "all") JCID = null;
                    if (type === "all") type = null;
                    if (level === "all") level = null;
                    if (keyword === "") keyword = null;
                    jobController.listSearchTable(JCID, type, level, keyword, function (searchTable) {
                        jobModel.countWithCondition(JCID, type, level, keyword).then(function (numberOfJobs) {
                            if (JCID === null) JCID = "all";
                            if (type === null) type = "all";
                            if (level === null) level = "all";
                            if (keyword === null) keyword = "";
                            if (JCID !== "all")
                                jobCateModel.singleByID(JCID).then(function (jc) {
                                    res.render('job-search', {
                                        numberOfJobs: numberOfJobs[0].numberOfJobs,
                                        JCID: JCID,
                                        jobcategory: jc[0].name,
                                        type: type,
                                        level: level,
                                        keyword: keyword,
                                        searchTable: searchTable
                                    })
                                })
                            else res.render('job-search', {
                                numberOfJobs: numberOfJobs[0].numberOfJobs,
                                JCID: JCID,
                                jobcategory: JCID,
                                type: type,
                                level: level,
                                keyword: keyword,
                                searchTable: searchTable
                            })
                        });
                    });
                }
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
            case 'more':
                var click = req.body.click_more;
                if (click === '1') {
                    req.session.recentPos += 10;
                    var type = req.body.type;
                    var jobCate = req.session.recentJCID;
                    var pos = req.session.recentPos;
                    jobController.updateFilterTable(jobCate, type, pos, function (job) {
                        res.send(job)
                    });
                }
                else if (click === '2') {
                    var JCID = req.body.JCID;
                    if (JCID !== "all") JCID = parseInt(JCID);
                    var type = req.body.type;
                    var level = req.body.level;
                    var keyword = req.body.keyword;
                    var pos = 0;
                    jobController.updateSearchTable(JCID, type, level, keyword, pos, function (job) {
                        res.send(job)
                    });
                }
                break;
            case 'profile':
                var UID = params.uid;
                res.render('profile');
                break;
        }
    }
};
