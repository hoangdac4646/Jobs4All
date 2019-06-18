var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from jobtransaction');
    },

    singleByID: JTID => {
        return db.load(`select * from jobtransaction where JTID = ${JTID}`);
    },

    listByCompany: CID => {
        return db.load(`select * from jobtransaction where CID = '${CID}'`);
    },

    listByCVWithCVInfo: CVID => {
        return db.load(`select jt.*,cv.name, cv.image,cv.description,cv.content,cv.status as cvStatus from jobtransaction jt inner join cv cv on cv.CVID = jt.CVID where jt.CVID = '${CVID}'`);
    },

    listInRange: (JTID,CVID,CID,JID,join_cv,join_job,join_company,pos,limit)=> {
        var option = ``;
        var join = ``;

        if (JTID !== null) {
            if (option !== ``) option += ` and `;
            option += `jt.UID = ${JTID}`;

        }
        if (CVID !== null) {
            if (option !== ``) option += ` and `;
            option += `jt.CVID = ${CVID}`;

        }

        if (CID !== null) {
            if (option !== ``) option += ` and `;
            option += `jt.CID = ${CID}`;

        }
        if (JID !== null) {
            if (option !== ``) option += ` and `;
            option += `jt.JID = ${JID}`;

        }

        var select = ``;

        if (join_cv === `join`) {
            join += ` inner join cv cv on cv.CVID = jt.CVID`;
            select += `,cv.UID,cv.name,cv.description,cv.content,cv.image,cv.status as cvStatus`;
        }

        if (join_job === `join`) {
            join += ` inner join job j on j.JID = jt.JID`;
            select += `, j.name as job`;
        }

        if (join_company === `join`) {
            join += ` inner join company c on c.CID = jt.CID`;
            select += `, c.name as company`;
        }

        var condition = ``;
        if (option !== "") condition = `where ${option}`;

        var s_limit = ``;
        if (limit !== null) s_limit = `limit ${pos},${limit}`;

        var query = `select jt.* ${select} from jobtransaction jt ${join} ${condition} order by JTID desc ${s_limit}`;

        return db.load(query);
    },

    add: entity => {
        return db.add('jobtransaction', entity);
    },

    update: entity => {
        return db.update('jobtransaction', 'JTID', entity);
    },

    delete: JTID => {
        return db.delete('jobtransaction', 'JTID', JTID);
    },
};
