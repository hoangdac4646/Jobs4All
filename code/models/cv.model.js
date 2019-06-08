var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from cv');
    },

    allRecent: () => {
        return db.load(`select * from cv order by created_date desc`);
    },

    allByJobCategory: JCID => {
        return db.load(`select * from cv where JCID = ${JCID}`);
    },

    allByJobType: job_type => {
        return db.load(`select * from cv where job_type = '${job_type}'`);
    },

    singleByID: CVID => {
        return db.load(`select * from cv where CVID = ${CVID}`);
    },


    listInRange: (JCID,job_type,pos,limit)=> {
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
        var condition = `where ${option}`;
        var query = `select * from cv ${condition} limit ${pos},${limit} order by JID desc`;

        return db.load(query);

    },

    add: entity => {
        return db.add('cv', entity);
    },

    update: entity => {
        return db.update('cv', 'CVID', entity);
    },

    delete: id => {
        return db.delete('cv', 'CVID', id);
    },
};
