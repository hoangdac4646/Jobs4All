var jobModel = require('../models/job.model');
var companyModel = require('../models/job.model');
var ejs = require('ejs');
var path = __dirname.replace('/controller', '');

module.exports = {
    listFilterTable: function (JCID, callback) {
        var jc;
        var more = ``;
        if (JCID != null) {
            if (JCID === "all") JCID = null;
            jc = 1;
        }
        jobModel.listInRange(JCID, null, null, null, null, 'join', 'join', 0, 10).then(function (recentJob) {
            jobModel.listInRange(JCID, null, 'full time', null, null, 'join', 'join', 0, 10).then(function (fulltimeJob) {
                jobModel.listInRange(JCID, null, 'part time', null, null, 'join', 'join', 0, 10).then(function (parttimeJob) {
                    jobModel.listInRange(JCID, null, 'intern', null, null, `join`, 'join', 0, 10).then(function (internJob) {
                        if (jc === 1) more = `<div class="col-lg-4"></div>`
                        ejs.renderFile(path + '/views/elements/job-filter-table.ejs', {
                            recentJob: recentJob,
                            fulltimeJob: fulltimeJob,
                            parttimeJob: parttimeJob,
                            internJob: internJob,
                            more: more
                        }, function (err, str) {
                            callback(str);
                        });
                    });
                });
            });
        });
    },
    updateFilterTable: function (JCID, type, pos, callback) {
        if (type === 'recent') type = null;
        if (JCID === "all") JCID = null;
        jobModel.listInRange(JCID, null, type, null, null, 'join', 'join', pos, pos + 10).then(function (jobs) {
            if (type === null) type = 'recent';
            var html = ``;
            var counter = 0;
            if (jobs.length !== 0)
                jobs.forEach(function (job) {
                    ejs.renderFile(path + '/views/elements/job-filter-table-item.ejs', {
                        job: job,
                        job_type: type
                    }, function (err, str) {
                        if (job.status === "available")
                            html += str;
                        counter++;
                    });
                    if (counter === jobs.length) callback(html);
                });
            else
                callback(html);

        });
    },
    getDetails: function (JID, callback) {
        jobModel.details(JID).then(function (job) {
            ejs.renderFile(path + '/views/elements/job-details.ejs', {job: job[0]}, function (err, str) {
                callback(str, job);
            })
        });
    },
    getDetailsTagListByCompany: function (CID, callback) {
        jobModel.detailsByCompany(CID).then(function (jobs) {
            var available = ``;
            var expired = ``;
            var counter = 0;
            if (jobs.length !== 0)
                jobs.forEach(function (job) {
                    ejs.renderFile(path + '/views/elements/job-details-tag.ejs', {
                        job: job,
                    }, function (err, str) {
                        if (job.status === "available")
                            available += str;
                        else if (job.status === "expired")
                            expired += str;
                        counter++;
                    });
                    if (counter === jobs.length) callback(available+expired,available,expired);
                });
            else
                callback(available);
        })
    },
    listSearchTable: function (JCID, type, level, keyword, callback) {
        if (JCID === "all") JCID = null;
        if (type === "all") type = null;
        if (level === "all") level = null;
        if (keyword === "") keyword = null;

        jobModel.listForSearch(JCID, type, level, keyword, 'join', 'join', 0, 10).then(function (jobs) {
            if (type === null) type = 'all';
            var html = ``;
            var counter = 0;
            if (jobs.length !== 0)
                jobs.forEach(function (job) {
                    ejs.renderFile(path + '/views/elements/job-filter-table-item.ejs', {
                        job: job,
                        job_type: type
                    }, function (err, str) {
                        if (job.status === "available")
                            html += str;
                        counter++;
                    });
                    if (counter === jobs.length) callback(html);
                });
            else
                callback(html);
        });
    },
    updateSearchTable: function (JCID, type, level, keyword, post, callback) {
        if (JCID === "all") JCID = null;
        if (type === "all") type = null;
        if (level === "all") level = null;
        if (keyword === "") keyword = null;

        jobModel.listForSearch(JCID, type, level, keyword, 'join', 'join', post, post + 10).then(function (jobs) {
            if (type === null) type = 'all';
            var html = ``;
            var counter = 0;
            if (jobs.length !== 0)
                jobs.forEach(function (job) {
                    ejs.renderFile(path + '/views/elements/job-filter-table-item.ejs', {
                        job: job,
                        job_type: type
                    }, function (err, str) {
                        if (job.status === "available")
                            html += str;
                    });
                    if (counter === jobs.length) callback(html);
                });
            else
                callback(html);
        });
    }
}