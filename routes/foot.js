var http = require('http');

var footData = [];
// Foot data
var getFootData = function(){
  var options = {
    hostname: 'api.football-data.org',
    port: 80,
    path: '/alpha/teams/524/fixtures',
    method: 'GET',
    headers: {
      'X-Auth-Token': '561c5c7ec4914ac99d933970e5cad6b9'
    }
  };

  try{
    http.get(options, function(res) {
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        data = JSON.parse(bodyChunks.join(''));
        data.fixtures = data.fixtures.map(function(f){
          f.matchId = f._links.self.href.split('/').pop();
          return f;
        });
        footData = data;
        console.log("Get foot data req: done");
      })
    });
  }
  catch(e){
    console.log("Get foot data req: ERROR: " + e);
  }
};

getFootData();
setInterval(getFootData, 1200000);

var footRoute = {
  define : function(app){
    app.get('/api/v1/foot', function(req, res){
      res.json(footData);
    });
  },
  getData: function(){
    return footData;
  }
} 

module.exports = footRoute;
