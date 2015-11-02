angular.module('LoginController', [])
  
.controller('loginCtrl', [
  'User',
  '$rootScope',
  '$scope', 
  '$state', 
  function (User, $rootScope, $scope, $state) {
    $scope.loginForm = {};
    $scope.failed = false;
    $scope.loading = false;

    $scope.register = function(form){
      if(!form.$valid) return;
      $scope.loading = true;
      User.register($scope.loginForm.uname, $scope.loginForm.email, $scope.loginForm.pwd)
        .then(function(data){
          $rootScope.user = data.data;
          $rootScope.user.password = pwd;
          $scope.loading = false;
          $state.go("tabs.home");
        }, function(err){
          $scope.loading = false;
          $scope.failed = true;
        });
    }  

    $scope.login = function(form){
      if(!form.$valid) return;
      $scope.loading = true;
      User.login($scope.loginForm.uname, $scope.loginForm.pwd)
        .then(function(data){
          $rootScope.user = data.data;
          $rootScope.user.password = data.pwd;
          $scope.loading = false;
          $state.go("tabs.home");
        }, function(err){
          $scope.loading = false;
          $scope.failed = true;
        });
    }  
}])