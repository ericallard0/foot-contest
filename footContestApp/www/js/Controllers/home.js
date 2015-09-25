angular.module('HomeController', [])
  
.controller('homeCtrl', [
  'Foot',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Foot, $rootScope, $scope, $state) {

  $scope.fixtures = [];
  $scope.error = '';
  $scope.doRefresh = function(){
    Foot.getFixtures()
    .then(function(data){
      $scope.fixtures = data.data.fixtures;
      $scope.$broadcast('scroll.refreshComplete');
    }, 
    function(error){
      $scope.error = error;
    });
  }

  $scope.doRefresh();

}])