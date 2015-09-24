angular.module('HomeController', [])
  
.controller('homeCtrl', [
  'Foot',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Foot, $rootScope, $scope, $state) {

  $scope.fixtures = [];
  $scope.error = '';

  Foot.getFixtures()
  .then(function(data){
    $scope.fixtures = data.data.fixtures;
  }, 
  function(error){
    $scope.error = error;
  });

}])