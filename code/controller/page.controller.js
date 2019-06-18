var userModel = require('../models/user.model');
var companyModel = require('../models/company.model');
var cvModel = require('../models/cv.model');
var jobModel = require('../models/job.model');
var jobTransModel = require('../models/jobtransaction.model');
var jobCateModel = require('../models/jobcategory.model');
var jobController = require('../controller/job.controller');
var companyController = require('../controller/company.controller');
var userController = require('../controller/user.controller');
var bcrypt = require('bcrypt');
var passport = require('passport');


module.exports = {
    authenticate: function (res, role, next) {
        if (res.locals.authUser.role !== role) {
            return res.redirect("/");
        }
    },
    run: function (req, res, next, page, params) {
        var sess = req.session;
        if (page === 'home') {
            sess.recentJCID = "all";
            sess.recentPos = 0;
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
                };

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
            sess.recentJCID = "all";
            sess.recentPos = 0;
            if (jobCateName === 'all') {
                sess.recentJCID = jobCateName;
                jobController.listFilterTable(jobCateName, function (jobFilterTable) {
                    jobModel.countAvailble().then(function (numberOfJobs) {
                        return res.render('job-category', {
                            title: title,
                            numberOfJobs: numberOfJobs[0].numberOfJobs,
                            jobFilterTable: jobFilterTable,
                        })

                    })

                });
            }
            else {
                jobCateModel.singleWithJobsCount(jobCateName, "available").then(function (jobCate) {
                    if (jobCate.length === 0) {
                        return res.render('404');
                    }
                    else {
                        var JCID = jobCate[0].JCID;
                        sess.recentJCID = JCID;
                        title += jobCateName;
                        jobController.listFilterTable(JCID, function (jobFilterTable) {
                            return res.render('job-category', {
                                title: title,
                                numberOfJobs: jobCate[0].numberOfJobs,
                                jobFilterTable: jobFilterTable,
                            });
                        })
                    }
                })
            }
        } else if (page === 'job-search') {
            sess.recentPos = 0;
            sess.recentJCID = "all";
            if (req.method === 'GET') {
                jobController.listSearchTable(null, null, null, null, function (searchTable) {
                    jobModel.countAvailble().then(function (numberOfJobs) {
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
                if (jobInfo.length === 0 || jobInfo[0].status !== "available"){
                    return res.render('404');
                }
                else {
                    userModel.singleEmployerByCID(jobInfo[0].CID).then(function (manager) {
                        return res.render('job', {
                            jobDetails: jobDetails,
                            companyName: jobInfo[0].company,
                            companyImage: jobInfo[0].logo,
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
                        cvModel.listInRange(null, UID, null, null, "public", null, null, null, null).then(function (CVs) {
                            return res.render('profile', {user: user[0], CVs: CVs});
                        })
                    }
                }
                else return res.render('404');
            });
        } else if (page === 'company') {
            var CID = params.CID;
            companyModel.singleByIDWithType(CID).then(function (company) {
                if (company.length !== 0)
                    jobController.getDetailsTagListByCompany(company[0].CID, function (jobDetailsList, availableList, expiredList) {
                        userModel.singleEmployerByCID(company[0].CID).then(function (manager) {
                            jobCateModel.listByCIDWithJobsCount(company[0].CID).then(function (jobCates) {
                                return res.render('company', {
                                    jobCates: jobCates,
                                    company: company[0],
                                    availableList: availableList,
                                    expiredList: expiredList,
                                    manager: manager[0]
                                });
                            })
                        });
                    })
                else return res.render('404');
            });
        }
        else if (page === 'cv') {
            if (req.method === "GET") {
                var thisUser = res.locals.authUser;
                var UID = params.UID;
                var CVID = params.CVID;

                userModel.singleByID(UID).then(function (user) {
                    cvModel.singleByID(CVID).then(function (cv) {
                        if (cv.length !== 0 && user.length !== 0) {
                            if (cv[0].status === "public" || (thisUser !== undefined && thisUser.UID === parseInt(UID))) {
                                return res.render('cv', {layout: false, user: user[0], cv: cv[0]});
                            }
                            else return res.render('404');
                        }
                        else return res.render('404');
                    })
                })
            }
        } else if (page === 'more-jobs') {
            var click = req.body.click_more;
            if (click === '1') {
                sess.recentPos += 10;
                var type = req.body.type;
                var jobCate = sess.recentJCID;
                var pos = sess.recentPos;
                jobController.updateFilterTable(jobCate, type, pos, function (job) {
                    return res.send(job)
                });
            }
            else if (click === '2') {
                sess.recentPos += 10;
                var JCID = req.body.JCID;
                if (JCID !== "all") JCID = parseInt(JCID);
                var type = req.body.type;
                var level = req.body.level;
                var keyword = req.body.keyword;
                var pos = sess.recentPos;
                jobController.updateSearchTable(JCID, type, level, keyword, pos, function (job) {
                    return res.send(job)
                });
            }
        }
    },
    runEmployee: function (req, res, next, page, params) {
        if (page === 'dashboard') {
            var user = res.locals.authUser;
            userModel.singleByUserName(user.username).then(function (thisUser) {
                cvModel.listInRange(null, thisUser[0].UID, null, null, "public", null, null, null, null).then(function (CVs) {
                    return res.render('dashboard/main', {
                        layout: "layouts/dashboard",
                        dashboard: "main",
                        user: thisUser[0],
                    });
                })
            });
        } else if (page === 'my-account') {
            var user = res.locals.authUser;
            userModel.singleByUserName(user.username).then(function (thisUser) {
                cvModel.listInRange(null, thisUser[0].UID, null, null, "public", null, null, null, null).then(function (CVs) {
                    return res.render('dashboard/my-account', {
                        layout: "layouts/dashboard",
                        dashboard: "my-account",
                        user: thisUser[0]
                    });
                })
            });
        } else if (page === 'my-account/edit') {
            var user = res.locals.authUser;
            if (req.method === "POST") {
                var edit = req.body.edit_profile;
                var reset = req.body.reset_password;
                var entity;
                if (edit !== undefined) {
                    var UID = user.UID;
                    var description = req.body.description;
                    var name = req.body.name;
                    var address = req.body.address;
                    var email = req.body.email;
                    var phone = req.body.phone;
                    var DOB = req.body.DOB;

                    entity = {
                        UID: UID,
                        name: name,
                        description: description,
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
                    return res.redirect('/dashboard/my-account');
                })

            }
        }
        else if (page === 'my-cv') {
            var user = res.locals.authUser;
            userModel.singleByUserName(user.username).then(function (thisUser) {
                cvModel.listInRange(null, thisUser[0].UID, null, null, null, null, "join", null, null).then(function (CVs) {
                    var cvList = [];
                    var counter = 0;
                    if (CVs.length !== 0)
                        CVs.forEach(function (cv) {
                            jobTransModel.listInRange(null, cv.CVID, null, null, "join", "join", "join", null, null).then(function (jobTrans) {
                                if (jobTrans.length > 0) {
                                    cvList.push(jobTrans[0]);
                                }
                                counter++;
                                if (counter === CVs.length)
                                    return res.render('dashboard/my-cv', {
                                        layout: "layouts/dashboard",
                                        dashboard: "my-cv",
                                        user: thisUser[0],
                                        allCVs: CVs,
                                        cvWithJT: cvList,
                                    });
                            })
                        });
                    else {
                        return res.render('dashboard/my-cv', {
                            layout: "layouts/dashboard",
                            dashboard: "my-cv",
                            user: thisUser[0],
                            allCVs: CVs,
                            cvWithJT: cvList,
                        })
                    }

                });
            });
        }
        else if (page === 'my-cv/edit') {
            var user = res.locals.authUser;
            if (req.method === "POST") {
                var addCV = req.body.add_cv;
                var updateCV = req.body.update_cv;
                var deleteCV = req.body.delete_cv;
                var loadCV = req.body.loadCV;

                if (loadCV === '1') {
                    var CVID = req.body.CVID;
                    cvModel.listInRange(CVID, null, null, null, null, null, "join", null, null).then(function (cv) {
                        return res.send(cv);
                    })
                }
                else if (addCV !== undefined) {
                    var name = req.body.name;
                    var JCID = req.body.jobcategory;
                    var description = req.body.description;
                    var content = req.body.content;
                    var status = req.body.status;

                    var entity = {
                        UID: user.UID,
                        name: name,
                        JCID: JCID,
                        description: description,
                        content: content,
                        status: status
                    }
                    cvModel.add(entity).then(function () {
                        return res.redirect('/dashboard/employee/my-cv');
                    })
                }
                else if (updateCV !== undefined) {
                    var CVID = req.body.CVID;
                    var name = req.body.name;
                    var JCID = req.body.jobcategory;
                    var description = req.body.description;
                    var content = req.body.content;
                    var status = req.body.status;

                    var entity = {
                        CVID: CVID,
                        name: name,
                        JCID: JCID,
                        description: description,
                        content: content,
                        status: status
                    }
                    cvModel.update(entity).then(function () {
                        return res.redirect('/dashboard/employee/my-cv');
                    })
                }
                else if (deleteCV !== undefined) {
                    var CVID = req.body.CVID;

                    jobTransModel.listByCVWithCVInfo(CVID).then(function (jobTrans) {
                        if (jobTrans.length !== 0)
                            jobTrans.forEach(function (jobTran) {
                                jobTransModel.delete(jobTran.JTID).then(function () {
                                    cvModel.delete(CVID).then(function () {
                                        return res.redirect('/dashboard/employee/my-cv');
                                    })
                                });
                            })
                        else cvModel.delete(CVID).then(function () {
                            return res.redirect('/dashboard/employee/my-cv');
                        })
                    })

                }
            }
        }
    },
    runEmployer: function (req, res, next, page, params) {
        this.authenticate(res, "employer");
        if (page === 'my-company') {
            var user = res.locals.authUser;
            companyModel.singleByID(user.CID).then(function (company) {
                if (company.length !== 0)
                    jobController.getDetailsTagListByCompany(company[0].CID, function (jobDetailsList, availableList, expiredList) {
                        userModel.singleEmployerByCID(company[0].CID).then(function (manager) {
                            jobCateModel.listByCIDWithJobsCount(company[0].CID).then(function (jobCates) {
                                return res.render('dashboard/my-company', {
                                    layout: "layouts/dashboard",
                                    dashboard: "employer/my-company",
                                    jobcates: jobCates,
                                    company: company[0],
                                    user: user,
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
            jobModel.listInRange(null, user.CID, null, null, null, 'join', 'join', null, null).then(function (jobs) {
                return res.render("dashboard/job-manager", {
                    layout: "layouts/dashboard",
                    dashboard: "employer/job-manager",
                    user: user,
                    jobs: jobs,
                });
            })


        } else if (page === 'job-manager/edit') {
            var user = res.locals.authUser;
            var CID = user.CID;
            if (req.method === "POST") {
                var addJob = req.body.add_job;
                var updateJob = req.body.update_job;
                var deleteJob = req.body.delete_job;
                var loadJob = req.body.loadJob;

                if (loadJob === '1') {
                    var JID = req.body.JID;
                    jobModel.singleByID(JID).then(function (jobs) {
                        return res.send(jobs);
                    })
                }
                else if (addJob !== undefined) {
                    var name = req.body.name;
                    var JCID = req.body.jobcategory;
                    var amount = req.body.amount;
                    var offer = req.body.offer;
                    var level = req.body.level;
                    var type = req.body.type;
                    var description = req.body.description;
                    var requirement = req.body.requirement;
                    var deadline = req.body.deadline;

                    var entity = {
                        name: name,
                        JCID: JCID,
                        status: "pending",
                        CID: CID,
                        amount: amount,
                        offer: offer,
                        level: level,
                        description: description,
                        requirement: requirement,
                        type: type,
                        deadline: deadline,
                    }
                    jobModel.add(entity).then(function () {
                        return res.redirect('/dashboard/employer/job-manager');
                    })
                }
                else if (updateJob !== undefined) {
                    var JID = req.body.JID;
                    var name = req.body.name;
                    var JCID = req.body.jobcategory;
                    var amount = req.body.amount;
                    var offer = req.body.offer;
                    var level = req.body.level;
                    var type = req.body.type;
                    var description = req.body.description;
                    var requirement = req.body.requirement;
                    var deadline = req.body.deadline;

                    var entity = {
                        JID: JID,
                        status: "pending",
                        name: name,
                        JCID: JCID,
                        amount: amount,
                        offer: offer,
                        level: level,
                        description: description,
                        requirement: requirement,
                        type: type,
                        deadline: deadline,
                    }
                    jobModel.update(entity).then(function () {
                        return res.redirect('/dashboard/employer/job-manager');
                    })
                }
                else if (deleteJob !== undefined) {
                    var JID = req.body.JID;

                    jobModel.delete(JID).then(function () {
                        return res.redirect('/dashboard/employer/job-manager');
                    })
                }
            }
        } else if (page === 'applicant-manager') {
            var user = res.locals.authUser;
            var applicants = [];
            jobModel.listInRange(null, user.CID, null, null, null, 'join', 'join', null, null).then(function (jobs) {
                jobTransModel.listByCompany(user.CID).then(function (jobTrans) {
                    if (jobTrans.length !== 0) {
                        jobTrans.forEach(function (jobTran) {
                            cvModel.singleByID(jobTran.CVID).then(function (appliedCV) {
                                userModel.singleByID(appliedCV[0].UID).then(function (appliedUser) {
                                    jobModel.singleByID(jobTran.JID).then(function (appliedJob) {
                                        var tmp_applicant = {
                                            JTID: jobTran.JTID,
                                            JID: appliedJob[0].JID,
                                            job: appliedJob[0].name,
                                            UID: appliedUser[0].UID,
                                            name: appliedUser[0].name,
                                            cvImage: appliedCV[0].image,
                                            CVID: appliedCV[0].CVID,
                                            status: jobTran.status,
                                        };
                                        applicants.push(tmp_applicant);
                                        if (applicants.length === jobTrans.length)
                                            return res.render("dashboard/applicant-manager", {
                                                layout: "layouts/dashboard",
                                                dashboard: "employer/applicant-manager",
                                                user: user,
                                                jobs: jobs,
                                                applicants: applicants
                                            });
                                    })
                                })
                            })
                        })
                    }
                    else return res.render("dashboard/applicant-manager", {
                        layout: "layouts/dashboard",
                        dashboard: "employer/applicant-manager",
                        jobs: jobs,
                        user: user,
                        applicants: applicants
                    });
                })
            })
        } else if (page === "applicant-manager/update") {
            var update = req.body.update;
            if (update === '1') {
                var JTID = req.body.JTID;
                var status = req.body.status;
                var entity = {
                    JTID: JTID,
                    status: status
                }

                jobTransModel.update(entity).then(function () {
                    return res.redirect("/dashboard/employer/applicant-manager");
                })

            }

        }
    },
    runAdmin: function (req, res, next, page) {
        this.authenticate(res, "admin");
        var user = res.locals.authUser;
        if (page === "account-manager") {
            userModel.all().then(function (users) {
                userModel.allEmployerWithCompany().then(function (employers) {
                    return res.render("dashboard/account-manager", {
                        layout: "layouts/dashboard",
                        dashboard: "admin/account-manager",
                        users: users,
                        employers: employers,
                        user: user,
                    });
                })
            })
        } else if (page === "account-manager/edit") {
            return res.render("dashboard/account-manager", {
                layout: "layouts/dashboard",
                dashboard: "admin/account-manager",
                jobs: jobs,
                user: user,
                applicants: applicants
            });
        } else if (page === "company-manager") {
            companyModel.all().then(function (companies) {
                return res.render("dashboard/company-manager", {
                    layout: "layouts/dashboard",
                    dashboard: "admin/company-manager",
                    companies: companies,
                    user: user,
                })
            });
        } else if (page === "company-manager/edit") {
            return res.render("dashboard/applicant-manager", {
                layout: "layouts/dashboard",
                dashboard: "admin/applicant-manager",
                user: user,
            });
        } else if (page === "job-manager") {
            jobModel.listInRange(null, null, null, null, null, 'join', 'join', null, null).then(function (jobs) {
                return res.render("dashboard/job-manager", {
                    layout: "layouts/dashboard",
                    dashboard: "admin/job-manager",
                    user: user,
                    jobs: jobs,
                });
            })
        } else if (page === "job-manager/edit") {
            if (req.method === "POST") {

                var updateJob = req.body.update_job;
                var deleteJob = req.body.delete_job;
                var loadJob = req.body.loadJob;

                if (loadJob === '1') {
                    var JID = req.body.JID;
                    jobModel.singleByID(JID).then(function (jobs) {
                        return res.send(jobs);
                    })
                }
                else if (updateJob !== undefined) {
                    var JID = req.body.JID;
                    var name = req.body.name;
                    var JCID = req.body.jobcategory;
                    var amount = req.body.amount;
                    var offer = req.body.offer;
                    var level = req.body.level;
                    var type = req.body.type;
                    var status = req.body.status;
                    var description = req.body.description;
                    var requirement = req.body.requirement;
                    var deadline = req.body.deadline;

                    var entity = {
                        JID: JID,
                        name: name,
                        JCID: JCID,
                        amount: amount,
                        offer: offer,
                        level: level,
                        description: description,
                        requirement: requirement,
                        type: type,
                        status: status,
                        deadline: deadline,
                    }
                    jobModel.update(entity).then(function () {
                        return res.redirect('/dashboard/admin/job-manager');
                    })
                }
                else if (deleteJob !== undefined) {
                    var JID = req.body.JID;

                    jobModel.delete(JID).then(function () {
                        return res.redirect('/dashboard/admin/job-manager');
                    })
                }
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
    }
    ,
    loadMore: function () {

    }
}
;
