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

    singleByIDWithCompany: JID => {
        return db.load(`select j.* , c.name as company from job j inner join company c on j.CID = c.CID where j.JID = ${JID}`);
    },

    listInRange: (JCID, CID, type, level, status, join_company, join_jobcategory, pos, limit) => {
        var option = ``;

        if (type !== null) {
            option += `j.type = '${type}'`
        }

        if (JCID !== null) {
            if (option !== ``) option += ` and `;
            option += `j.JCID = ${JCID}`;

        }
        if (CID !== null) {
            if (option !== ``) option += ` and `;
            option += `j.CID = ${CID}`;

        }

        if (status !== null) {
            if (option !== ``) option += ` and `;
            option += `j.status = '${status}'`;

        }
        var select = ``;
        var join = ``;

        if (join_company === `join`) {
            join += ` inner join company c on j.CID = c.CID`;
            select += `, c.name as company,  c.logo as image`;
        }

        if (join_jobcategory === `join`) {
            join += ` inner join jobcategory jc on j.JCID = jc.JCID`;
            select += `, jc.name as jobcategory`;
        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var s_limit = ``;
        if (limit !== null) s_limit = `limit ${pos},${limit}`;

        var query = `select j.* ${select} from job j ${join} ${condition} order by JID desc ${s_limit}`;

        return db.load(query);

    },

    listForSearch: (JCID, type, level, keyword, join_company, join_jobcategory, pos, limit) => {
        var option = ``;
        var status = "available";

        if (type !== null) {
            option = `j.type = '${type}'`
        }

        if (JCID !== null) {
            if (option !== ``) option += ` and `;
            option += `j.JCID = ${JCID}`;

        }

        if (level !== null) {
            if (option !== ``) option += ` and `;
            option += `j.level = '${level}'`;

        }

        if (keyword !== null) {
            if (option !== ``) option += ` and `;
            option += `j.name like "%'${keyword}'%"`;

        }

        if (status !== null) {
            if (option !== ``) option += ` and `;
            option += `j.status = '${status}'`;

        }

        var select = ``;
        var join = ``;

        if (join_company === `join`) {
            join += ` inner join company c on j.CID = c.CID`;
            select += `, c.name as company,  c.logo as image`;
        }

        if (join_jobcategory === `join`) {
            join += ` inner join jobcategory jc on j.JCID = jc.JCID`;
            select += `, jc.name as jobcategory`;
        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var s_limit = ``;
        if (limit !== null) s_limit = `limit ${pos},${limit}`;

        var query = `select j.* ${select} from job j ${join} ${condition} order by JID desc ${s_limit}`;

        return db.load(query);
    },

    details: JID => {
        var query = `select j.* , c.name as company, c.description as cdescription, c.address as location, c.logo as logo , jc.name as jobcategory from job j inner join company c on j.CID = c.CID inner join jobcategory jc on j.JCID = jc.JCID where j.JID = ${JID}`;
        return db.load(query);
    },

    detailsByCompany: CID => {
        var query = `select j.* , c.name as company, c.description as cdescription, c.address as location , jc.name as jobcategory from job j inner join company c on j.CID = c.CID inner join jobcategory jc on j.JCID = jc.JCID where j.CID = ${CID}`;
        return db.load(query);
    },

    countAvailble: () => {
        return db.load(`select count(JID) as numberOfJobs from job where status = "available"`);
    },

    countWithCondition: (JCID, type, level, keyword) => {
        var option = ``;

        if (type !== null) {
            option = `j.type = '${type}'`
        }

        if (JCID !== null) {
            if (option !== ``) option += ` and `;
            option += `j.JCID = ${JCID}`;

        }

        if (level !== null) {
            if (option !== ``) option += ` and `;
            option += `j.level = '${level}'`;

        }

        if (keyword !== null) {
            if (option !== ``) option += ` and `;
            option += `j.name like "%'${keyword}'%"`;

        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var query = `select count(JID) as numberOfJobs from job j ${condition}`;

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
