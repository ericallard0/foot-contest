angular.module('MainController', [])
  
.controller('mainCtrl', [
  '$rootScope', 
  '$scope', 
  '$state', 
  function ($rootScope, $scope, $state) {
    
    $rootScope.$on('$stateChangeStart', 
      function(event, toState, toParams, fromState, fromParams){
        if(toState.name !== "login" 
          && (!$rootScope.user || !$rootScope.user.username || !$rootScope.user.password))
            $state.go("login");
      });
    
    $rootScope.user = {};
    
}])