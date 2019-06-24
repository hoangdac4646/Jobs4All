var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from jobcategory order by name');
    },

    allWithJobsCount: jobStatus => {
        var option = ``;
        if (jobStatus !== null) {
            option = `j.status = '${jobStatus}'`
        }
        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var query = `select jc.JCID,jc.icon,jc.name, count(j.JID) as numberOfJobs from jobcategory as jc left join job as j using(JCID) ${condition} group by jc.JCID,jc.icon,jc.name order by jc.name`
        return db.load(query);
    },


    singleWithJobsCount: (name,jobStatus) => {
        var option = `where jc.name = '${name}'`;

        if (jobStatus !== null) {
            if (option !== ``) option += ` and `;
            option = `j.status = '${jobStatus}'`
        }
        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var query = `select jc.JCID,jc.icon,jc.name, count(j.JID) as numberOfJobs from jobcategory as jc left join job as j using(JCID) ${condition} group by jc.JCID,jc.icon,jc.name order by jc.name`
        return db.load(query);
    },

    listByCIDWithJobsCount: (CID) => {
        return db.load(`select jc.JCID,jc.name, c.CID ,count(j.JID) as numberOfJobs from jobcategory as jc inner join job j using(JCID) inner join company c using(CID) where c.CID = ${CID} group by jc.JCID,jc.name,c.CID order by jc.name`);
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
