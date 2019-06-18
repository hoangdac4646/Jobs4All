var db = require('../utils/db');

module.exports = {
    all: () => {
        return db.load('select * from user');
    },

    allByRole: role => {
        return db.load(`select * from user where role = ${role}`);
    },

    allExecptAdmin: () => {
        return db.load(`select * from user where role != 'admin'`);
    },

    allRecent: () => {
        return db.load(`select * from user order by created_date desc`);
    },

    allEmployerWithCompany: () => {
        return db.load(`select u.*,c.name as company from user u inner join company c on u.CID = c.CID where u.role = "employer" order by created_date desc`);
    },

    singleByID: UID => {
        return db.load(`select * from user where UID = ${UID}`);
    },

    singleByUserName: userName => {
        return db.load(`select * from user where username = '${userName}'`);
    },

    singleByEmail: email => {
        return db.load(`select * from user where email = '${email}'`);
    },

    singleEmployerByCID: CID => {
        return db.load(`select u.* , c.name as company from user u inner join company c on u.CID = c.CID where u.CID = ${CID}`);
    },

    singleEmployerByUserName: userName => {
        return db.load(`select u.* , c.name as company from user u inner join company c on u.CID = c.CID where u.username = '${userName}'`);
    },

    add: entity => {
        return db.add('user', entity);
    },

    update: entity => {
        return db.update('user', 'UID', entity);
    },

    delete: UID => {
        return db.delete('user', 'UID', UID);
    }
};
