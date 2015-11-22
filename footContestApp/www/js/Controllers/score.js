angular.module('ScoreController', [])
  
.controller('scoreCtrl', [
  'Score',
  '$rootScope', 
  '$scope', 
  '$state', 
  '$q', 
  function (Score, $rootScope, $scope, $state, $q) {

  var defered = $q.defer()
  $scope.scoreDataPromise = defered.promise;
  
  var getScoreData = function(){
    $scope.scoreData = Score.getAllPastPredicted($rootScope.users, $rootScope.fixtures);
  }

  $scope.doRefresh = function(f, u){
    Score.getSortedUsers({
      fixtures: f,
      users: u,
    })
    .then(function(users){
      $rootScope.users = users;
      $scope.rank = Score.getRank(users, $rootScope.user)
      $scope.$broadcast('scroll.refreshComplete');
      getScoreData();
      defered.resolve();
    });
  }
  if($rootScope.users.length === 0){
    $scope.doRefresh($rootScope.fixtures);
  }
  else if(!$rootScope.users[0].score){
    $scope.doRefresh($rootScope.fixtures, $rootScope.users); 
  }
  else{
    $scope.rank = Score.getRank($rootScope.users, $rootScope.user);
    getScoreData();
    defered.resolve();
  }
}])