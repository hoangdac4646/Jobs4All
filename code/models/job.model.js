var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from job');
    },

    allRecent: () => {
        return db.load(`select * from job order by created_date desc`);
    },

    allByJobCategory: (JCID) => {
        return db.load(`select * from job where JCID = ${JCID}`);
    },

    allByCompany: (CID) => {
        return db.load(`select * from job where CID = ${CID}`);
    },

    allByJobType: (job_type) => {
        return db.load(`select * from job where job_type = '${job_type}'`);
    },

    singleByID: JID => {
        return db.load(`select * from job where JID = ${JID}`);
    },

    singleByName: name => {
        return db.load(`select * from job where name = '${name}'`);
    },

    listInRange: (pos,JCID,CID,job_type,status,limit)=> {
        var option = ``;

        if (job_type !== "")
        {
            option = `job_type = '${job_type}'`
        }

        if (JCID !== -1)
        {
            if (option !== ``) option += ` and `;
                option += `JCID = ${JCID}`;

        }
        if (CID !== -1)
        {
            if (option !== ``) option += ` and `;
            option += `CID = ${CID}`;

        }

        if (status !== "")
        {
            if (option !== ``) option += ` and `;
            option += `status = ${status}`;

        }
        var condition = `where ${option}`;
        var query = `select * from job ${condition} limit ${pos},${limit} order by JID desc`;

        return db.load(query);

    },

    add: entity => {
        return db.add('job', entity);
    },

    update: entity => {
        return db.update('job', 'JID', entity);
    },

    delete: id => {
        return db.delete('job', 'JID', id);
    },
};
