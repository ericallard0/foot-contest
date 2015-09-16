angular.module('ScoreController', [])
  
.controller('scoreCtrl', [
  'Score',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Score, $rootScope, $scope, $state) {

  $scope.scores = [];

  Score.getAllScores()
  .then(function(scores){
    $scope.scores = _.sortBy(scores, 'score').reverse();
  });
}])