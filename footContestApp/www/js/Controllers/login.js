angular.module('LoginController', [])
  
.controller('loginCtrl', [
  'User',
  '$rootScope',
  '$scope', 
  '$state', 
  function (User, $rootScope, $scope, $state) {

    $scope.register = function(uname, email, pwd){
      User.register(uname, email, pwd)
        .then(function(data){
          $rootScope.user = data.data;
          $rootScope.user.password = pwd;
          $state.go("tabs.home");
        }, function(err){
          console.error(err);
        });
    }  

    $scope.login = function(uname, pwd){
      User.login(uname, pwd)
        .then(function(data){
          $rootScope.user = data.data;
          $rootScope.user.password = pwd;
          $state.go("tabs.home");
        }, function(err){
          console.error(err);
        });
    }  
}])