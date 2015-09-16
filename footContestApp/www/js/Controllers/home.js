angular.module('HomeController', [])
  
.controller('homeCtrl', [
  'Foot',
  'Score',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Foot, Score, $rootScope, $scope, $state) {

  $scope.fixtures = [];

  Foot.getFixtures()
  .then(function(data){
    $scope.fixtures = data.data.fixtures;
  });

  // Score.getScores()
  // .then(function(data){
  //   console.log(data);
  // });
}])