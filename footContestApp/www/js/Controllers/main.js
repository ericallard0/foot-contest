angular.module('MainController', [])
  
.controller('mainCtrl', [
  '$rootScope', 
  '$scope', 
  '$state', 
  function ($rootScope, $scope, $state) {
    
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        if(["login", "register"].indexOf(toState.name) === -1 
          && (!$rootScope.user || !$rootScope.user.username || !$rootScope.user.password)){
            console.log("forbiden");
            location.hash = "/";
          }
      });
    
    $rootScope.user = {};
    
}])