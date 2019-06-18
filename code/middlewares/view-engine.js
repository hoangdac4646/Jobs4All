module.exports = function (app) {
    app.set('views', "./views");
    app.set('view engine', 'ejs');
    app.use(require('express-ejs-layouts'));
    app.set("layout extractScripts", true);
    app.set("layout extractStyles", true);
    app.set('layout', 'layouts/layout');
}