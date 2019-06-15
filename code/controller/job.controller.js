var jobModel = require('../models/job.model');
var jobCateModel = require('../models/jobcategory.model');
var ejs = require('ejs');
var path = __dirname.replace('/controller', '');

module.exports = {
    listFilterTable: function (JCID, callback) {
        var jc;
        if (JCID != null) {
            if (JCID === "all") JCID = null;
            jc = 1;
        }
        jobModel.listInRange(JCID, null, null, null, "available", 'join', 'join', 0, 10).then(function (recentJob) {
            jobModel.listInRange(JCID, null, 'full time', "available", null, 'join', 'join', 0, 10).then(function (fulltimeJob) {
                jobModel.listInRange(JCID, null, 'part time', "available", null, 'join', 'join', 0, 10).then(function (parttimeJob) {
                    jobModel.listInRange(JCID, null, 'intern', "available", null, `join`, 'join', 0, 10).then(function (internJob) {
                        jobCateModel.allWithJobsCount("available").then(function (jobCates) {
                            if (jc === 1) {
                                ejs.renderFile(path + '/views/elements/job-filter-table.ejs', {
                                    recentJob: recentJob,
                                    fulltimeJob: fulltimeJob,
                                    parttimeJob: parttimeJob,
                                    internJob: internJob,
                                    more: true,
                                    title: "Số lượng việc làm theo ngành",
                                    jobCates: jobCates,
                                }, function (err, str) {
                                    callback(str);
                                });
                            }
                            else
                                ejs.renderFile(path + '/views/elements/job-filter-table.ejs', {
                                    recentJob: recentJob,
                                    fulltimeJob: fulltimeJob,
                                    parttimeJob: parttimeJob,
                                    internJob: internJob,
                                    more: undefined,
                                }, function (err, str) {
                                    callback(str);
                                });
                        })
                    });
                });
            });
        });
    },
    updateFilterTable: function (JCID, type, pos, callback) {
        if (type === 'recent') type = null;
        if (JCID === "all") JCID = null;
        jobModel.listInRange(JCID, null, type, null, "available", 'join', 'join', pos, pos + 10).then(function (jobs) {
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
                    if (counter === jobs.length) callback(available + expired, available, expired);
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
                        counter++
                    });
                    if (counter === jobs.length) callback(html);
                });
            else
                callback(html);
        });
    }
}