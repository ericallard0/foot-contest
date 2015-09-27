var http = require('http');

var footData = [];
// Foot data
var getFootData = function(){

  try{
    http.get({
      host: 'api.football-data.org',
      path: '/alpha/teams/524/fixtures'
    }, function(res) {
      // Buffer the body entirely for processing as a whole.
      var bodyChunks = [];
      res.on('data', function(chunk) {
        // You can process streamed parts here...
        bodyChunks.push(chunk);
      }).on('end', function() {
        footData = JSON.parse(bodyChunks.join(''));
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
