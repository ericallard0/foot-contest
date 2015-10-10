angular.module('PredictionsController', [])
  
.controller('predictionsCtrl', [
  'Foot',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Foot, $rootScope, $scope, $state) {

  $scope.error = '';
  $scope.doRefresh = function(){
    Foot.getFixtures()
    .then(function(data){
      $rootScope.fixtures = data;
      $scope.$broadcast('scroll.refreshComplete');
    }, 
    function(error){
      $scope.error = error;
    });
  }
  if($rootScope.fixtures.length === 0){
    $scope.doRefresh();
  }
}])