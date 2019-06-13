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
