var jobCateModel = require('../models/jobcategory.model');

module.exports = (req, res, next) => {
    jobCateModel.allWithJobsCount(null).then(rows => {
        res.locals.lcJobCategory = rows;
        next();
    })
};
