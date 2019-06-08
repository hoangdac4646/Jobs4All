var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from jobcategory');
    },

    allWithJobsCount: (pos,limit) => {
        return db.load(`select jc.JCID,jc.icon,jc.name, count(j.JID) as numberOfJobs from jobcategory as jc left join job as j using(JCID) group by jc.JCID,jc.icon,jc.name limit ${pos},${limit}`);
    },

    singleWithJobsCount: (name) => {
        return db.load(`select jc.JCID,jc.icon,jc.name, count(j.JID) as numberOfJobs from jobcategory as jc left join job as j using(JCID) where jc.name = '${name}' group by jc.JCID,jc.icon,jc.name`);
    },

    singleByID: id => {
        return db.load(`select * from jobcategory where JCID = ${id}`);
    },

    singleByName: name => {
        return db.load(`select * from jobcategory where name = '${name}'`);
    },

    add: entity => {
        return db.add('jobcategory', entity);
    },

    update: entity => {
        return db.update('jobcategory', 'JCID', entity);
    },

    delete: id => {
        return db.delete('jobcategory', 'JCID', id);
    },
};
