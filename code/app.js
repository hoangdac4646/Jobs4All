var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var auth = require('./middlewares/auth');

app.use(express.static(path.join(__dirname, './public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);
app.set('layout', 'layouts/layout');


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

require('./middlewares/session')(app);
require('./middlewares/upload')(app);
require('./middlewares/passport')(app);

app.use(require('./middlewares/auth-locals.mdw'));
app.use(require('./middlewares/locals.mdw'));

app.use('/', require('./routes/general.route'));
app.use('/',auth, require('./routes/employee.route'));
app.use('/',auth, require('./routes/employer.route'));

app.use((req, res, next) => {
    return res.render('404');
});

app.listen(3000, function () {
    console.log('App is running on port 3000');
});
