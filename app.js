var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    morgan = require('morgan'),
    restful = require('node-restful'),
    mongoose = restful.mongoose,
    http = require('http');

// Application config variables
var config = {
  serverPort : process.env.PORT || 3000
}

var app = express();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(methodOverride());

mongoose.connect('mongodb://app:footContest123@ds027829.mongolab.com:27829/footcontest');
// mongoose.connect("mongodb://localhost/resources");

// Foot data
var footData = [];
var getFootData = function(){
  http.get({
    host: 'api.football-data.org',
    path: '/alpha/teams/524/fixtures'
  }, function(res) {
    console.log('STATUS: ' + res.statusCode);
    console.log('HEADERS: ' + JSON.stringify(res.headers));

    // Buffer the body entirely for processing as a whole.
    var bodyChunks = [];
    res.on('data', function(chunk) {
      // You can process streamed parts here...
      bodyChunks.push(chunk);
    }).on('end', function() {
      footData = JSON.parse(bodyChunks.join(''));
      console.log(JSON.stringify(footData));
    })
  });
};
getFootData();
setInterval(getFootData, 1200000);

app.get('/api/v1/foot', function(req, res){
  res.json(footData);
});

var routes = require('./routes/index');
routes.forEach(function(route) {
  route.define(app, "/api/v1");
});

app.use('/', express.static('./footContestApp/www'));

http.createServer(app).listen(config.serverPort, function() {
  console.log("Express server listening on port " + config.serverPort);
});
