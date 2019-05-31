var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, './public')));

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');
app.all('/', function(req, res, next) {
    res.render("index");
});
app.all('/about', function(req, res, next) {
    res.render("about");
});
app.all('/contact', function(req, res, next) {
    res.render("contact-us");
});
app.all('/job-category', function(req, res, next) {
    res.render("job-category");
});

app.all('/job-search', function(req, res, next) {
    res.render("job-search");
});

app.all('/job', function(req, res, next) {
    res.redirect("/job-search");
});

app.all('/job/:id', function(req, res, next) {
    res.render("job");
});

app.all('/manage-cv', function(req, res, next) {
    res.render("manage-cv");
});

app.all('/cv', function(req, res, next) {
    res.redirect("/manage-cv");
});

app.all('/cv/:id', function(req, res, next) {
    res.render("cv");
});

var server = require("http").Server(app);
server.listen(3000);
