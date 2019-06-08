var jobCateModel = require('../models/jobcategory.model');

module.exports = (req, res, next) => {
    jobCateModel.allWithJobsCount(0,8).then(rows => {
        res.locals.lcJobCategory = rows;
        next();
    })
};
