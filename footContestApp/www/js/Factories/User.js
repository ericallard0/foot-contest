angular.module('UserFactory', [])
.factory('User', [
  '$http',
  '$q',
  function (
    $http,
    $q
  ) {
  
  var User = {};
  var userRoute = '/api/v1/users';

  User.register = function(uname, email, pwd){
    return $http.post(userRoute, {
        username: uname,
        email: email,
        password: pwd
      });
  }

  User.login = function(uname, pwd){
    return $http.post(userRoute + '/login', {
        username: uname,
        password: pwd
      });
  }

  User.predict = function(userId, matchId, predictHome, predictAway){
    return $http.post(userRoute +'/'+ userId +'/predict', {
        matchId: matchId,
        predictHome: predictHome,
        predictAway: predictAway
      });
  }

  User.deletePrediction = function(userId, predictId){
    return $http.delete(userRoute +'/'+ userId +'/predict', {
        params: { predictId: predictId}
      });
  }


  return User;
}])