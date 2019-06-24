var jobCateModel = require('../models/jobcategory.model');
var companyTypeModel = require('../models/companytype.model');

module.exports = (req, res, next) => {
    jobCateModel.allWithJobsCount(null).then(rows => {
        res.locals.lcJobCategory = rows;
        companyTypeModel.all().then(rows => {
            res.locals.lcCompanyType = rows;
            next();
        })
    })
};
