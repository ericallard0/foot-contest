angular.module('FootFactory', [])
.factory('Foot', [
  '$http',
  '$q',
  function (
    $http,
    $q
  ) {
  
  var Foot = {};
  var apiRoute = 'http://api.football-data.org/alpha/';
  var team = 524; //PSG
  
  Foot.getFixtures = function(uname, email, pwd){
    var route = apiRoute + 'teams/' +team +'/fixtures';
    return $http.get(route);
  }

  return Foot;
}])