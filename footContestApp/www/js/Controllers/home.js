angular.module('HomeController', [])
  
.controller('homeCtrl', [
  'Foot',
  'Score',
  'User',
  '$q', 
  '$rootScope', 
  '$scope', 
  '$state', 
  function (Foot, Score, User, $q, $rootScope, $scope, $state) {

  $scope.error = '';
  $scope.rank = 0;
  var setCards = function(){
    var grouped = Foot.groupByStatus($rootScope.fixtures, $rootScope.user.predictions);
    $scope.firstMatch = _.last(grouped.FINISHED);
    $scope.nextMatch = _.first(grouped.PREDICTED);
    $scope.todoMatch = _.first(grouped.TIMED);
    $scope.rank = Score.getRank($rootScope.users, $rootScope.user);
  }

  $scope.doRefresh = function(options){
    if(options && options.fixtures) var getFixtures = $q.when(options.fixtures);
    else var getFixtures = Foot.getFixtures();
    
    if(options && options.users) var getUsers = $q.when(options.users);
    else var getUsers = User.getAll();

    $q.all([getFixtures, getUsers])
      .then(function(data){
        $rootScope.fixtures = data[0];
        var users = data[1];
        return Score.getSortedUsers({
          fixtures: $rootScope.fixtures,
          users: $rootScope.users
        });
      })
      .then(function(users){
        $rootScope.users = users;
        setCards();
        $scope.$broadcast('scroll.refreshComplete');
      });
  }

  if(!$rootScope.fixtures.length && $rootScope.users.length){
    $scope.doRefresh({
      users: $rootScope.users
    });
  }
  else if(!$rootScope.users.length && $rootScope.fixtures.length){
    $scope.doRefresh({
      fixtures: $rootScope.fixtures
    });
  }
  else if(!$rootScope.users.length && !$rootScope.fixtures.length){
    $scope.doRefresh();
  }
  else{
    setCards();
  }

}])