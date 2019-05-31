var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, './public')));

app.set('views', __dirname + '/templates');
app.set('view engine', 'ejs');

var mysql = require('mysql2');
var config = {
    host: 'jobs4all_mysql',
    user: 'root',
    password: '123456',
    database: 'app',
    port: '3306',
};

var db = mysql.createConnection(config);

db.connect(function (err) {
    if (err)
    {
        console.log(err);
    }
    else
    {
        app.all('/', function(req, res, next) {
            res.render("home");
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
    }
})


var server = require("http").Server(app);
server.listen(3000);
