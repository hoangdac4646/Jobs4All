var userModel = require('../models/user.model');
var companyModel = require('../models/company.model');
var cvModel = require('../models/cv.model');
var jobModel = require('../models/job.model');
var jobTransModel = require('../models/jobtransaction.model');
var jobCateModel = require('../models/jobcategory.model');
var jobController = require('../controller/job.controller');
var companyController = require('../controller/company.controller');
var userController = require('../controller/user.controller');
var ejs = require('ejs');
var bcrypt = require('bcrypt');
var passport = require('passport');


module.exports = {
    run: function (req, res, next, page, params) {
        if (page === 'home') {
            jobController.listFilterTable(null, function (jobFilterTable) {
                companyController.listBigCompany(function (bigCompanyList) {
                    return res.render('home', {jobFilterTable: jobFilterTable, bigCompanyList: bigCompanyList});
                })
            });
        } else if (page === 'login') {
            if (req.method === 'GET') {
                return res.render('login', {layout: false, err_message: res.locals.registermessage});
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
                        var sess = req.session;
                        sess.UID = user.UID;
                        sess.CID = user.CID;
                        return res.redirect('/');
                    });
                })(req, res, next);
            }
        } else if (page === 'register') {
            if (req.method === 'GET') {
                return res.render('register', {layout: false});
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
                    avatar: "/images/avatar/profile-placeholder.png",
                    role: 'employee'
                }

                userModel.add(entity).then(function () {
                    res.locals.registermessage = "success";
                    res.redirect('/login');
                })
            }
        } else if (page === 'logout') {
            req.logOut();
            return res.redirect('/');
        } else if (page === 'job-category') {
            var jobCateName = params.name;
            var title = "Danh sách việc làm ";
            req.session.recentPos = 0;
            if (jobCateName === 'all') {
                req.session.recentJCID = jobCateName;
                jobController.listFilterTable(jobCateName, function (jobFilterTable) {
                    jobModel.count().then(function (numberOfJobs) {
                        return res.render('job-category', {
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
                            return res.render('404');
                        }
                        else {
                            return res.render('job-category', {
                                title: title,
                                numberOfJobs: jobCate[0].numberOfJobs,
                                jobFilterTable: jobFilterTable
                            });
                        }
                    });
                })
            }
        } else if (page === 'job-search') {
            req.session.recentPos = 0;
            if (req.method === 'GET') {
                jobController.listSearchTable(null, null, null, null, function (searchTable) {
                    jobModel.count().then(function (numberOfJobs) {
                        return res.render('job-search', {
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
                                return res.render('job-search', {
                                    numberOfJobs: numberOfJobs[0].numberOfJobs,
                                    JCID: JCID,
                                    jobcategory: jc[0].name,
                                    type: type,
                                    level: level,
                                    keyword: keyword,
                                    searchTable: searchTable
                                })
                            })
                        else
                            return res.render('job-search', {
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
        } else if (page === 'job') {
            var JID = params.jid;
            jobController.getDetails(JID, function (jobDetails, jobInfo) {
                if (jobInfo.length === 0) {
                    return res.render('404');
                }
                else {
                    userModel.singleEmployerByCID(jobInfo[0].CID).then(function (manager) {
                        return res.render('job', {
                            jobDetails: jobDetails,
                            companyName: jobInfo[0].company,
                            companyImage: jobInfo[0].cimage,
                            manager: manager[0]
                        });
                    })
                }
            });
        } else if (page === 'contact') {
            return res.render('contact-us');
        } else if (page === 'about') {
            return res.render('about');
        } else if (page === 'profile') {
            var UID = params.UID;
            userModel.singleByID(UID).then(function (user) {
                if (user.length !== 0) {
                    if (user[0].role === "employer") {
                        userModel.singleEmployerByUserName(user[0].username).then(function (employer) {
                            return res.render('profile', {user: employer[0]});
                        });
                    }
                    else {
                        return res.render('profile', {user: user[0]});
                    }
                }
                else return res.render('404');
            });
        } else if (page === 'company') {
            var CID = params.CID;
            companyModel.singleByID(CID).then(function (company) {
                if (company.length !== 0)
                    jobController.getDetailsTagListByCompany(company[0].CID, function (jobDetailsList, availableList, expiredList) {
                        userModel.singleEmployerByCID(company[0].CID).then(function (manager) {
                            jobCateModel.listByCIDWithJobsCount(company[0].CID).then(function (jobcates) {
                                return res.render('company', {
                                    jobcates: jobcates,
                                    company: company[0],
                                    availableList: availableList,
                                    expiredList: expiredList,
                                    manager: manager[0]
                                });
                            })
                        });
                    })
                else return res.render('404');
            })
        } else if (page === 'more') {
            var click = req.body.click_more;
            if (click === '1') {
                req.session.recentPos += 10;
                var type = req.body.type;
                var jobCate = req.session.recentJCID;
                var pos = req.session.recentPos;
                jobController.updateFilterTable(jobCate, type, pos, function (job) {
                    return res.send(job)
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
                    return res.send(job)
                });
            }
        }
    },
    runEmployee: function (req, res, next, page, params) {
        if (page === 'my-account') {
            var user = res.locals.authUser;
            if (user.role === "employer") {
                userModel.singleEmployerByUserName(user.username).then(function (thisUser) {
                    return res.render('profile', {user: thisUser[0]});
                })
            }
            else {
                userModel.singleByUserName(user.username).then(function (thisUser) {
                    return res.render('profile', {user: thisUser[0]});
                });
            }
        } else if (page === 'my-account/edit') {
            var user = res.locals.authUser;
            if (req.method === "GET") {
                userModel.singleByUserName(user.username).then(function (thisUser) {
                    return res.render('employee/edit-profile', {user: thisUser[0]});
                });
            }
            else if (req.method === "POST") {
                var edit = req.body.edit_profile;
                var reset = req.body.reset_password;
                var entity;
                if (edit !== undefined) {
                    var UID = user.UID;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var DOB = req.body.DOB;

                    entity = {
                        UID: UID,
                        name: name,
                        address: address,
                        email: email,
                        phone: phone,
                        DOB: DOB,
                    };

                }
                else if (reset !== undefined) {
                    var UID = user.UID;
                    var password = req.body.password;

                    var saltRounds = 10;
                    var hash = bcrypt.hashSync(password, saltRounds);

                    entity = {
                        UID: UID,
                        password: hash,
                    };

                }
                userModel.update(entity).then(function () {
                    return res.redirect('/my-account');
                })

            }
        }
    },
    runEmployer: function (req, res, next, page, params) {
        if (page === 'my-company') {
            var user = res.locals.authUser;
            companyModel.singleByID(user.CID).then(function (company) {
                if (company.length !== 0)
                    jobController.getDetailsTagListByCompany(company[0].CID, function (jobDetailsList, availableList, expiredList) {
                        userModel.singleEmployerByCID(company[0].CID).then(function (manager) {
                            jobCateModel.listByCIDWithJobsCount(company[0].CID).then(function (jobcates) {
                                return res.render('company', {
                                    jobcates: jobcates,
                                    company: company[0],
                                    availableList: availableList,
                                    expiredList: expiredList,
                                    manager: manager[0]
                                });
                            })
                        });
                    })
                else return res.render('404');
            })
        } else if (page === 'my-company/edit') {
            var user = res.locals.authUser;
            if (req.method === "GET") {
                companyModel.singleByID(user.CID).then(function (company) {
                    if (company.length !== 0)
                        jobController.getDetailsTagListByCompany(company[0].CID, function (jobDetailsList, availableList, expiredList) {
                            userModel.singleEmployerByCID(company[0].CID).then(function (manager) {
                                return res.render('employer/edit-company', {
                                    company: company[0],
                                    availableList: availableList,
                                    expiredList: expiredList,
                                    manager: manager[0]
                                });
                            });
                        })
                    else return res.render('404');
                })
            } else if (req.method === "POST") {
                var editProfile = req.body.edit_profile;
                var editDescription = req.body.edit_description;
                var entity;
                if (editProfile !== undefined) {
                    var CID = user.CID;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;

                    entity = {
                        CID: CID,
                        name: name,
                        address: address,
                        email: email,
                        phone: phone,
                    };

                }
                else if (editDescription !== undefined) {
                    var CID = user.CID;
                    var description = req.body.description;

                    entity = {
                        CID: CID,
                        description: description,
                    };

                }
                companyModel.update(entity).then(function () {
                    return res.redirect('/my-company');
                })
            }
        } else if (page === 'job-manager') {
            var user = res.locals.authUser;
            var applicants = [];
            jobModel.listInRange(null, user.CID, null, null, null, 'join', 'join', null, null).then(function (jobs) {
                jobTransModel.listByCompany(user.CID).then(function (jobTrans) {
                    if (jobTrans.length !== 0) {
                        jobTrans.forEach(function (jobTran) {
                            cvModel.singleByID(jobTran.CVID).then(function (appliedCV) {
                                userModel.singleByID(appliedCV.UID).then(function (appliedUser) {
                                    jobModel.singleByID(appliedCV.JID).then(function (appliedJob) {
                                        var tmp_applicant = {
                                            JID: appliedJob[0].JID,
                                            job: appliedJob[0].name,
                                            UID: appliedUser[0].UID,
                                            name: appliedUser[0].name,
                                            avatar: appliedUser[0].avatar,
                                            CVID: appliedCV[0].CVID,
                                            status: jobTran.status,
                                        };
                                        applicants.push(tmp_applicant);
                                        if (applicants.length === jobTrans.length)
                                        return res.render("employer/job-manager", {jobs: jobs, applicants: applicants});
                                    })
                                })
                            })
                        })
                    }
                    else return res.render("employer/job-manager", {jobs: jobs, applicants: applicants});
                })
            })
        } else if (page === 'job-manager/edit') {
            if (req.method === "POST") {
                var JID = parseInt(req.body.JID);
                var name = req.body.name;
                var JCID = parseInt(req.body.JCID);
                var amount = parseInt(req.body.amount);
                var offer = parseInt(req.body.JID);
                var level = req.body.level;
                var type = req.body.type;
                var deadline = req.body.deadline;

                var entity = {
                    JID: JID,
                    name: name,
                    JCID: JCID,
                    amount: amount,
                    offer: offer,
                    level: level,
                    type: type,
                    deadline: deadline,
                }
                jobModel.update(entity).then(function (jobs) {
                    return res.redirect('/job-manager');
                })
            }
        }
    },
    validate: function (req, res, next, element) {
        switch (element) {
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
                var thisUser = res.locals.authUser;
                var email = req.query.email;
                if (thisUser === undefined) {
                    userModel.singleByEmail(email).then(user => {
                        if (user.length > 0) {
                            return res.json(false);
                        }
                        return res.json(true);
                    });
                }
                else {
                    userModel.singleByEmail(email).then(user => {
                        if (user.length > 0 && thisUser.UID !== user[0].UID) {
                            return res.json(false);
                        }
                        return res.json(true);
                    });
                }
                break;
            case 'verify-pass':
                var thisUser = res.locals.authUser;
                var password = req.query.current_password;
                if (!bcrypt.compareSync(password, thisUser.password)) {
                    return res.json(false);
                }
                return res.json(true);
                break;
        }
    },
    loadMore: function () {

    }
};
