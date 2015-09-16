angular.module('SettingsController', [])
  
.controller('settingsCtrl', [
  '$rootScope', 
  '$scope', 
  function ($rootScope, $scope) {
    $scope.devModeLocal = $rootScope.devMode;


    $scope.disconnect = function(){
      $rootScope.user = {};
      localStorage.removeItem('user');
      location.hash = "/";
      location.reload();
    }

    $scope.devModeChange = function(devMode){
      $rootScope.devMode = devMode;
    }

}])