angular.module('MainController', [])
  
.controller('mainCtrl', [
  '$rootScope', 
  '$scope', 
  '$state', 
  function ($rootScope, $scope, $state) {
    $rootScope.user = JSON.parse(localStorage.getItem('user')) || {};
    $rootScope.$watch('user', function(){
      localStorage.setItem('user', JSON.stringify($rootScope.user));
      console.log($rootScope.user);
    }, true);
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        if(["login", "register"].indexOf(toState.name) === -1 
          && (!$rootScope.user || !$rootScope.user.username || !$rootScope.user.password)){
            console.log("forbiden");
            location.hash = "/";
          }
      });
    
    
}])