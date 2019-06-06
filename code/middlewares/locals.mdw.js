var categoryModel = require('../models/jobcategory.model');

module.exports = (req, res, next) => {
  categoryModel.all().then(rows => {
    res.locals.lcJobCategory = rows;
    next();
  })
};
