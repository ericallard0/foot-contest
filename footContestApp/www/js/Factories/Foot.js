angular.module('FootFactory', [])
.factory('Foot', [
  '$http',
  '$q',
  function (
    $http,
    $q
  ) {
  
  var Foot = {};
  // var apiRoute = '/api/v1/foot';
  var apiRoute = 'http://footcontest.herokuapp.com/api/v1/foot';
  
  Foot.getFixtures = function(){
    return $http.get(apiRoute);
  }

  return Foot;
}])