var express = require('express');
var app = express();
app.use(express.static("./public"));

var server = require("http").Server(app);
server.listen(3000);