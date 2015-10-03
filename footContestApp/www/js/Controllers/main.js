angular.module('MainController', [])
  
.controller('mainCtrl', [
  '$rootScope', 
  '$scope', 
  '$state', 
  function ($rootScope, $scope, $state) {
    var redirectToLogin = function(event, toState, toParams, fromState, fromParams){
      if(["login", "register"].indexOf(toState.name) === -1 
        && (!$rootScope.user || !$rootScope.user.username || !$rootScope.user.password)){
          location.hash = "/login";
      }
    }
    $rootScope.user = JSON.parse(localStorage.getItem('user')) || {};
    $rootScope.$watch('user', function(){
      localStorage.setItem('user', JSON.stringify($rootScope.user));
    }, true);
    $rootScope.$on('$stateChangeStart', redirectToLogin);
    redirectToLogin({}, {name: location.hash.substr(2)});
    $rootScope.fixtures = [];
    $rootScope.users = [];
    $rootScope.devMode = false;
    $rootScope.showPast = true;
    
    
}])