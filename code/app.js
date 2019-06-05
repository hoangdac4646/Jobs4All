var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, './public')));

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(require('express-ejs-layouts'));

app.get('/', function (req, res, next) {
    res.render("home",{pagetype: 'home'});
});
app.get('/about', function (req, res, next) {
    res.render("about",{pagetype: 'home'});
});
app.get('/contact', function (req, res, next) {
    res.render("contact-us",{pagetype: 'home'});
});
app.get('/job-category', function (req, res, next) {
    res.render("job-category", {pagetype: 'home'});
});

app.get('/job-search', function (req, res, next) {
    res.render("job-search",{pagetype: 'home'});
});

app.get('/job', function (req, res, next) {
    res.redirect("/job-search");
});

app.get('/job/:id', function (req, res, next) {
    res.render("job",{pagetype: 'home'});
});

app.get('/my-cv', function (req, res, next) {
    res.render("employee/my-cv",{pagetype: 'home'});
});

app.get('/cv', function (req, res, next) {
    res.redirect("/manage-cv",{pagetype: 'home'});
});

app.get('/cv/:id', function (req, res, next) {
    res.render("cv",{pagetype: 'home'});
});

app.get('/login', function (req, res, next) {
    res.render("login",{pagetype: 'login'});
});

app.get('/register', function (req, res, next) {
    res.render("register",{pagetype: 'login'});
});

app.get('/profile/:id', function (req, res, next) {
    res.render("profile",{pagetype: 'home'});
});

app.get('/my-account', function (req, res, next) {
    res.render("my-account",{pagetype: 'home'});
});

app.get('/company/:name', function (req, res, next) {
    res.render("company",{pagetype: 'home'});
});


app.listen(3000, function () {
    console.log('App is running on port 3000');
});
