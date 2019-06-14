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

    listInRange: (UID,JCID,name,status,join_user,join_jobcategory,pos,limit)=> {
        var option = ``;
        var join = ``;

        if (UID !== null) {
            if (option !== ``) option += ` and `;
            option += `cv.UID = ${UID}`;

        }
        if (JCID !== null) {
            if (option !== ``) option += ` and `;
            option += `cv.JCID = ${JCID}`;

        }

        if (name !== null) {
            if (option !== ``) option += ` and `;
            option += `cv.name = ${name}`;

        }
        var select = ``;

        if (join_user === `join`) {
            join += ` inner join user u on cv.UID = u.UID`;
            select += `, u.name as fullname`;
        }

        if (join_jobcategory === `join`) {
            join += ` inner join jobcategory jc on cv.JCID = cv.JCID`;
            select += `, jc.name as jobcategory`;
        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var s_limit = ``;
        if (limit !== null) s_limit = `limit ${pos},${limit}`;

        var query = `select cv.* ${select} from cv cv ${join} ${condition} order by CVID desc ${s_limit}`;

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
