var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    http = require('http');

// Application config variables
var config = {
  serverPort : 3000
}

var app = express();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

mongoose.connect('mongodb://app:footContest123@ds027829.mongolab.com:27829/footcontest');
// mongoose.connect("mongodb://localhost/resources");

var routes = require('./routes/index');
routes.forEach(function(route) {
  route.define(app, "/api/v1");
});

app.use('/', express.static('./footContestApp/www'));

http.createServer(app).listen(3000, function() {
  console.log("Express server listening on port 3000");
});
