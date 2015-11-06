angular.module('FootFactory', [])
.factory('Foot', [
  '$http',
  '$q',
  function (
    $http,
    $q
  ) {
  
  var Foot = {};
  var apiRoute = 'http://footcontest.herokuapp.com/api/v1/foot';
  if(location.hostname === "localhost") apiRoute = '/api/v1/foot';
  
  Foot.getFixtures = function(){
    return $http.get(apiRoute)
      .then(function(data){
        // Update each fixture with matchId
        return data.data.fixtures.map(function(fixt){
          fixt.matchId = _.last(fixt._links.self.href.split('/'));
          return fixt;
        });
      })
  }

  Foot.groupByStatus = function(fixtures, predictions){
    return _.groupBy(fixtures, function(f){
      var isPredicted = !!_.findWhere(predictions, {matchId: f.matchId});;
      var status = f.status;
      if(f.status !== "FINISHED" && isPredicted){
        return "PREDICTED";
      }
      else{
        return f.status;
      }
    });
  }

  return Foot;
}])