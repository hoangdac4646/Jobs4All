var userModel = require("../models/user.model");
var path = __dirname.replace('/controller', '');

var ejs = require('ejs');

module.exports = {
    getMinimalProfile: function (UID, callback) {
        userModel.singleByID(UID).then(function (user) {
            ejs.renderFile(path + '/views/elements/minimal-profile.ejs', {
            }, function (err, str) {
                callback(str);
            });
        });
    }
};