var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");
var auth = require('./middlewares/auth');

app.use(express.static(path.join(__dirname, './public')));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

require('./middlewares/session')(app);
require('./middlewares/upload')(app);
require('./middlewares/passport')(app);
require('./middlewares/view-engine')(app);

app.use(require('./middlewares/auth-locals.mdw'));
app.use(require('./middlewares/locals.mdw'));

app.use('/', require('./routes/general.route'));
app.use('/dashboard/',auth, require('./routes/employee.route'));
app.use('/dashboard/employer/',auth, require('./routes/employer.route'));
app.use('/dashboard/admin/',auth, require('./routes/admin.route'));

app.use((req, res, next) => {
    return res.render('404');
});

app.listen(3000, function () {
    console.log('App is running on port 3000');
});
