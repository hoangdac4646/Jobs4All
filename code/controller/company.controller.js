var companyModel = require("../models/company.model");
var companytypeModel = require("../models/companytype.model");

var ejs = require('ejs');

module.exports = {
    listBigCompany: function (callback) {
        companyModel.listInRange(null, null, 0, 6).then(function (company) {
            ejs.renderFile(__dirname.replace('/controller', '') + '/views/elements/big-company-list.ejs', {
                bigCompany: company,
            }, function (err, str) {
                callback(str);
            });
        });
    },
    listJoin: function (callback) {
        companyModel.listInRange(null, null, 0, 6).then(function (company) {
            ejs.renderFile(__dirname.replace('/controller', '') + '/views/elements/big-company-list.ejs', {
                bigCompany: company,
            }, function (err, str) {
                callback(str);
            });
        });
    }
};