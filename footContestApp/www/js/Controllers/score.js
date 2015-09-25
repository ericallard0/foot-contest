angular.module('ScoreController', [])
  
.controller('scoreCtrl', [
  'Score',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Score, $rootScope, $scope, $state) {

  $scope.scores = [];
  $scope.rank = 0;

  $scope.doRefresh = function(){
    Score.getAllScores()
    .then(function(scores){
      $scope.scores = _.sortBy(scores, 'score').reverse();
      $scope.rank = _.findIndex($scope.scores, function(e){
        return e._id == $rootScope.user._id;
      }) +1;
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  $scope.doRefresh();
}])