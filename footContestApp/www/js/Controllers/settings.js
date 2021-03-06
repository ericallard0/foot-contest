
angular.module('SettingsController', [])
  
.controller('settingsCtrl', [
  '$rootScope', 
  '$scope', 
  function ($rootScope, $scope) {
    $scope.devModeLocal = $rootScope.devMode;
    $scope.showPastLocal = $rootScope.showPast;


    $scope.disconnect = function(){
      $rootScope.user = {};
      localStorage.removeItem('user');
      location.hash = "/";
      location.reload();
    }

    $scope.devModeChange = function(devMode){
      $rootScope.devMode = devMode;
      localStorage.setItem('devMode', devMode);
    }

    $scope.showPastChange = function(showPast){
      $rootScope.showPast = showPast;
      localStorage.setItem('showPast', showPast);
    }

}])