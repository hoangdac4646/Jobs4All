var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user');
    },

    allByRole: role => {
        return db.load(`select * from user where role = ${role}`);
    },

    allExecptAdmin: () => {
        return db.load(`select * from user where role = 'admin'`);
    },

    allRecent: () => {
        return db.load(`select * from user order by created_date desc`);
    },

    singleByID: id => {
        return db.load(`select * from user where UID = ${id}`);
    },

    singleByUserName: userName => {
        return db.load(`select * from user where username = '${userName}'`);
    },

    singleByEmail: email => {
        return db.load(`select * from user where email = '${email}'`);
    },

    add: entity => {
        return db.add('user', entity);
    },

    update: entity => {
        var id = entity.UID;
        delete entity.UID;
        return db.update('user', 'UID', entity, id);
    },

    delete: id => {
        return db.delete('user', 'UID', id);
    }
};
