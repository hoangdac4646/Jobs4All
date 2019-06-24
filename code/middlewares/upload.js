var multer = require('multer');
var userModel = require('../models/user.model');
var companyModel = require('../models/company.model');
var cvModel = require('../models/cv.model');
var jobCateModel = require('../models/jobcategory.model');

const AVATAR_DEFAULT = "/images/avatar/default.png";
const LOGO_DEFAULT = "/images/company/default.png";
const CV_IMAGE_DEFAULT = "/images/cv/default.png";
const JOB_CATEGORY_IMAGE_DEFAULT = "/images/category/default.png";

module.exports = function (app) {
    app.post('/upload-avatar', (req, res, next) => {
        var sess = req.session,
            UID = sess.UID;
        userModel.singleByID(UID).then(function (user) {
            var path = "./public/images/avatar/";
            var filename;
            if (user.length === 0 || user[0].avatar === AVATAR_DEFAULT) {
                filename = UID.toString() + ".png";
                userModel.update({
                    UID: UID,
                    avatar: "/images/avatar/" + filename
                })
            }
            else {
                filename = user[0].avatar.split('/');
                filename = filename[filename.length - 1];
            }
            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            });

            var upload = multer({storage});
            upload.array('avatar')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    })
    app.post('/upload-avatar/:UID', (req, res, next) => {
        var UID = req.params.UID;
        userModel.singleByID(UID).then(function (user) {
            var path = "./public/images/avatar/";
            var filename;
            if (user.length === 0 || user[0].avatar === AVATAR_DEFAULT) {
                filename = UID.toString() + ".png";
                userModel.update({
                    UID: UID,
                    avatar: "/images/avatar/" + filename
                })
            }
            else {
                filename = user[0].avatar.split('/');
                filename = filename[filename.length - 1];
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            })

            var upload = multer({storage});
            upload.array('avatar-input')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    });
    app.post('/upload-cv-image/:CVID', (req, res, next) => {
        var CVID = req.params.CVID;
        cvModel.singleByID(CVID).then(function (cv) {
            var path = "./public/images/cv/";
            var filename;
            if (cv.length === 0 || cv[0].image === CV_IMAGE_DEFAULT) {
                filename = CVID.toString() + ".png";
                cvModel.update({
                    CVID: CVID,
                    image: "/images/cv/" + filename
                })
            }
            else {
                filename = cv[0].image.split('/');
                filename = filename[filename.length - 1];
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            });

            var upload = multer({storage});
            upload.array('image-input')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    });
    app.post('/upload-company-logo', (req, res, next) => {
        var sess = req.session,
            CID = sess.CID;
        companyModel.singleByID(CID).then(function (company) {
            var path = "./public/images/company/";
            var filename;
            if (company.length === 0 || company[0].logo === LOGO_DEFAULT) {
                filename = CID.toString() + ".png";
                companyModel.update({
                    CID: CID,
                    image: "/images/company/" + filename
                })
            }
            else {
                filename = company[0].logo.split('/');
                filename = filename[filename.length - 1];
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            });

            var upload = multer({storage});
            upload.array('logo')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    });
    app.post('/upload-company-logo/:CID', (req, res, next) => {
        var CID = req.params.CID;

        companyModel.singleByID(CID).then(function (company) {
            var path = "./public/images/company/";
            var filename;
            if (company.length === 0 || company[0].logo === LOGO_DEFAULT) {
                filename = CID.toString() + ".png";
                companyModel.update({
                    CID: CID,
                    logo: "/images/company/" + filename
                })
            }
            else {
                filename = company[0].logo.split('/');
                filename = filename[filename.length - 1];
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            });

            var upload = multer({storage});
            upload.array('logo-input')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    })
    app.post('/upload-category-icon/:JCID', (req, res, next) => {
        var JCID = req.params.JCID;
        jobCateModel.singleByID(JCID).then(function (jobcate) {
            var path = "./public/images/category/";
            var filename;
            if (jobcate.length === 0 || jobcate[0].icon === JOB_CATEGORY_IMAGE_DEFAULT) {
                filename = JCID.toString() + ".png";
                jobCateModel.update({
                    JCID: JCID,
                    icon: "/images/category/" + filename
                })
            }
            else {
                filename = jobcate[0].icon.split('/');
                filename = filename[filename.length - 1];
            }

            var storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, path);
                },
                filename: function (req, file, cb) {
                    cb(null, filename);
                }
            });

            var upload = multer({storage});
            upload.array('image-input')(req, res, err => {
                if (err) {
                    return res.json({
                        error: err.message
                    });
                }
                else {
                    return res.json({path: path + filename});
                }
            })
        })
    });
};

