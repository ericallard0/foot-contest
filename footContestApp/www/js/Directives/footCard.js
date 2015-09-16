angular.module('FootCardDirective', [])
.directive('footCard', ['User', 'Score', '$rootScope', function (User, Score, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl : '/templates/footcard.html',
    link: function (scope, iElement, iAttrs) {
      // Replace Paris Saint-Germain to PSG
      scope.fixture.awayTeamName = scope.fixture.awayTeamName.replace("Paris Saint-Germain", "PSG");
      scope.fixture.homeTeamName = scope.fixture.homeTeamName.replace("Paris Saint-Germain", "PSG");
      scope.fixture.awayTeamName = scope.fixture.awayTeamName.replace("FC Girondins de Bordeaux", "Bordeaux");
      scope.fixture.homeTeamName = scope.fixture.homeTeamName.replace("FC Girondins de Bordeaux", "Bordeaux");
      scope.fixture.date = (new Date(scope.fixture.date)).toLocaleString();
      
      scope.isOpen = false;
      var matchId = scope.fixture._links.self.href.split('/').pop();
      scope.prono = _.findWhere($rootScope.user.predictions, {matchId: matchId});
      scope.isPredicted = !!scope.prono;
      scope.matchScore = 0;
      if(scope.isPredicted && scope.fixture.status === 'FINISHED'){
        scope.matchScore = Score.getMatchScore(scope.fixture, scope.prono);
      }

      scope.predict = function(predictHome, predictAway){
        var userId = $rootScope.user._id;
        User.predict(userId, matchId, predictHome, predictAway)
          .then(function(data){
            console.log(data);
            $rootScope.user.predictions = data.data.predictions;
            scope.prono = _.findWhere($rootScope.user.predictions, {matchId: matchId});
            scope.isPredicted = !!scope.prono;
          }, 
          function(err){
            console.log(err);
          });
      }

      scope.deletePrediction = function(id){
        var userId = $rootScope.user._id;
        User.deletePrediction(userId, id)
          .then(function(data){
            console.log(data);
            $rootScope.user.predictions = data.data.predictions;
            scope.prono = _.findWhere($rootScope.user.predictions, {matchId: matchId});
            scope.isPredicted = !!scope.prono;
          }, 
          function(err){
            console.log(err);
          });

      }
    }
  };
}])