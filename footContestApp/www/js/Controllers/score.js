angular.module('ScoreController', [])
  
.controller('scoreCtrl', [
  'Score',
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Score, $rootScope, $scope, $state) {

  $scope.rank = 0;

  $scope.doRefresh = function(f){
    Score.getSortedUsers({
      fixtures: f
    })
    .then(function(users){
      $rootScope.users = users;
      $scope.rank = Score.getRank(users, $rootScope.user)
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  if($rootScope.users.length === 0){
    $scope.doRefresh($rootScope.fixtures);
  }
  else{
    $scope.rank = Score.getRank($rootScope.users, $rootScope.user);
  }
}])