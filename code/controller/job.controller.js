var jobModel = require('../models/job.model');
var companyModel = require('../models/job.model');
var ejs = require('ejs');
var path = __dirname.replace('/controller', '');

module.exports = {
    listFilterTable: function (jobcategory, callback) {
        jobModel.listInRange(null, null, null, null, 'join', 'join', 0, 5).then(function (recentJob) {
            jobModel.listInRange(null, null, 'full time', null, 'join', 'join', 0, 5).then(function (fulltimeJob) {
                jobModel.listInRange(null, null, 'part time', null, 'join', 'join', 0, 5).then(function (parttimeJob) {
                    jobModel.listInRange(null, null, 'intern', null, `join`, 'join', 0, 5).then(function (internJob) {
                        var more = ``;
                        if (jobcategory !== null && jobcategory !== 'all') {
                            for (var i = 0; i < recentJob.length; i++) {
                                if (recentJob[i].jobcategory !== jobcategory) {
                                    recentJob.splice(i, 1);
                                    i--;
                                }
                            }
                            for (var i = 0; i < fulltimeJob.length; i++) {
                                if (fulltimeJob[i].jobcategory !== jobcategory) {
                                    fulltimeJob.splice(i, 1);
                                    i--;
                                }
                            }
                            for (var i = 0; i < parttimeJob.length; i++) {
                                if (parttimeJob[i].jobcategory !== jobcategory) {
                                    parttimeJob.splice(i, 1);
                                    i--;
                                }
                            }
                            for (var i = 0; i < internJob.length; i++) {
                                if (internJob[i].jobcategory !== jobcategory) {
                                    internJob.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                        if (jobcategory !== null) more = `<div class="col-lg-4"></div>`
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
    updateFilterTable: function (jobcategory, type, callback) {
        if (type === 'recent') type = null;
            jobModel.listInRange(null, null, type, null, 'join', 'join', 0, 5).then(function (jobs) {
                if (jobcategory !== null && jobcategory !== 'all') {
                    for (var i = 0; i < jobs.length; i++) {
                        if (jobs[i].jobcategory !== jobcategory) {
                            jobs.splice(i, 1);
                            i--;
                        }
                    }
                }
                if (type === null) type = 'recent';
                var html = ``;
                var counter = 0;
                jobs.forEach(function (job) {
                    ejs.renderFile(path + '/views/elements/job-filter-table-item.ejs', {
                        job: job,
                        job_type: type
                    }, function (err, str) {
                        html += str;
                        counter++;
                    });
                    if (counter === jobs.length) callback(html);
                });

            });
        },
    getDetails: function (JID, callback) {
        jobModel.details(JID).then(function (job) {
            ejs.renderFile(path + '/views/elements/job-details.ejs', {job: job[0]}, function (err, str) {
                callback(str, job[0]);
            })
        });
    },
}