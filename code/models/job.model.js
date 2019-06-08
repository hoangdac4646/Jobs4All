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

    allByJobType: (type) => {
        return db.load(`select * from job where type = '${type}'`);
    },

    singleByID: JID => {
        return db.load(`select * from job where JID = ${JID}`);
    },

    singleByName: name => {
        return db.load(`select * from job where name = '${name}'`);
    },

    listInRange: (JCID, CID, type, status, join_company, join_jobcategory, pos, limit) => {
        var option = ``;
        var join = ``;

        if (type !== null) {
            option = `type = '${type}'`
        }

        if (JCID !== null) {
            if (option !== ``) option += ` and `;
            option += `JCID = ${JCID}`;

        }
        if (CID !== null) {
            if (option !== ``) option += ` and `;
            option += `CID = ${CID}`;

        }

        if (status !== null) {
            if (option !== ``) option += ` and `;
            option += `status = ${status}`;

        }
        var select = ``;

        if (join_company === `join`) {
            join += ` inner join company c on j.CID = c.CID`;
            select += `, c.name as company`;
        }

        if (join_jobcategory === `join`) {
            join += ` inner join jobcategory jc on j.JCID = jc.JCID`;
            select += `, jc.name as jobcategory`;
        }

        var condition = "";
        if (option !== "") condition = `where ${option}`;


        var query = `select j.* ${select} from job j ${join} ${condition} order by JID desc limit ${pos},${limit}`;

        return db.load(query);

    },

    details: JID => {
        var query = `select j.* , c.name as company, c.description as cdescription, c.address as location , jc.name as jobcategory from job j inner join company c on j.CID = c.CID inner join jobcategory jc on j.JCID = jc.JCID where j.JID = ${JID}`;
        return db.load(query);
    },

    count: () => {
        return db.load(`select count(JID) as numberOfJobs from job`);
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
