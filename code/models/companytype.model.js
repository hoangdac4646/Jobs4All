var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from companytype');
    },

    singleByID: id => {
        return db.load(`select * from companytype where CTID = ${id}`);
    },

    singleByName: name => {
        return db.load(`select * from companytype where name = '${name}'`);
    },

    add: entity => {
        return db.add('companytype', entity);
    },

    update: entity => {
        return db.update('companytype', 'CTID', entity);
    },

    delete: id => {
        return db.delete('companytype', 'CTID', id);
    },
};
