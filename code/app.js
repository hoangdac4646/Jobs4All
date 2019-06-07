var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, './public')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

require('./middlewares/session')(app);
require('./middlewares/upload')(app);
require('./my_modules/login')(app);

app.use(require('./middlewares/auth-locals.mdw'));
app.use(require('./middlewares/locals.mdw'));

app.use('/', require('./routes/job.route'));
app.use('/', require('./routes/jobcategory.route'));
app.use('/', require('./routes/user.route'));

app.get('/about', function (req, res, next) {
    res.render("about",{pageType: 'home'});
});
app.get('/contact', function (req, res, next) {
    res.render("contact-us",{pageType: 'home'});
});
app.get('/job-category', function (req, res, next) {
    res.render("job-category", {pageType: 'home'});
});

app.get('/job-search', function (req, res, next) {
    res.render("job-search",{pageType: 'home'});
});

app.get('/job', function (req, res, next) {
    res.redirect("/job-search");
});

app.get('/job/:id', function (req, res, next) {
    res.render("job",{pageType: 'home'});
});

app.get('/my-cv', function (req, res, next) {
    res.render("employee/my-cv",{pageType: 'home'});
});

app.get('/cv', function (req, res, next) {
    res.redirect("/manage-cv",{pageType: 'home'});
});

app.get('/cv/:id', function (req, res, next) {
    res.render("cv",{pageType: 'home'});
});

app.get('/profile/:id', function (req, res, next) {
    res.render("profile",{pageType: 'home'});
});

app.get('/my-account', function (req, res, next) {
    res.render("my-account",{pageType: 'home'});
});

app.get('/company/:name', function (req, res, next) {
    res.render("company",{pageType: 'home'});
});

app.listen(3000, function () {
    console.log('App is running on port 3000');
});
