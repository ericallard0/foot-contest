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
  
  Foot.translateName = function(name){
    name = name.replace("Paris Saint-Germain", "PSG");
    name = name.replace("FC Girondins de Bordeaux", "Bordeaux");
    name = name.replace("Montpellier Hérault SC", "Montpellier");
    name = name.replace("AS Monaco FC", "AS Monaco");
    name = name.replace("Stade de Reims", "Reims");
    name = name.replace("Olympique de Marseille", "OM");
    name = name.replace("Stade Rennais", "Rennes");
    name = name.replace("Olympique Lyonnais", "Olymp. Lyonnais");
    name = name.replace("FC Nantes", "Nantes");
    name = name.replace("EA Guingamp", "Guingamp");
    name = name.replace("Shakhtar Donetsk", "Sh. Donetsk");
    return name;
  }
  
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