var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var route = require('./api/routes')

var port = process.env.PORT || 3000;

app.use(express.static(__dirname));
var accessLogStream = fs.createWriteStream(__dirname + '/api/logs/access.log', {flags: 'a'});
app.use(morgan('common'));
//app.use(morgan('common', {stream: accessLogStream})) //SWITCH LOG SAVE

/**
 * To support JSON-encoded bodies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/**
 * Routing to routes.js file
 */
app.use('/', route);

app.listen(port);
console.log("Server Running Successfully at port " + port);

module.exports = app;