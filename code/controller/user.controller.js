var userModel = require("../models/user.model");
var path = __dirname.replace('/controller', '');

var ejs = require('ejs');

module.exports = {
    getMinimalProfile: function (UID, callback) {
        userModel.singleByID(UID).then(function (user) {
            ejs.renderFile(path + '/views/elements/profile-minimal.ejs', {
            }, function (err, str) {
                callback(str);
            });
        });
    }
};