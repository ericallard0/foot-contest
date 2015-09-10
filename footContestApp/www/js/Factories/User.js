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


  return User;
}])