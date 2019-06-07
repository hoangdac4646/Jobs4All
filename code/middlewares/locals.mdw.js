var categoryModel = require('../models/jobcategory.model');

module.exports = (req, res, next) => {
    categoryModel.allWithJobsCount().then(rows => {
        res.locals.lcJobCategory = rows;
        next();
    })
};
