var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from company');
    },

    singleByID: id => {
        return db.load(`select * from company where CID = ${id}`);
    },

    singleByIDWithType: id => {
        return db.load(`select c.*, ct.name as companytype from company as c inner join companytype ct on c.CTID = ct.CTID where c.CID = ${id}`);
    },

    singleByName: name => {
        return db.load(`select * from company join companytype where name = '${name}'`);
    },

    allWithType: () => {
        return db.load(`select  c.*, ct.name as companytype from company c inner join companytype ct on c.CTID = ct.CTID`);
    },

    listInRange: (CID,name,pos,limit)=> {
        var option = ``;

        if (CID !== null)
        {
            option = `job_type = '${CID}'`
        }

        if (name !== null)
        {
            if (option !== ``) option += ` and `;
            option += `name = ${name}`;

        }

        var condition = "";
        if (option !== "") condition = `where ${option}`;

        var query = `select * from company ${condition} order by CID desc limit ${pos},${limit}`;

        return db.load(query);

    },

    add: entity => {
        return db.add('company', entity);
    },

    update: entity => {
        return db.update('company', 'CID', entity);
    },

    delete: CID => {
        return db.delete('company', 'CID', CID);
    },
};
