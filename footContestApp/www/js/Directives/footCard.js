angular.module('FootCardDirective', [])
.directive('footCard', ['User', 'Score', '$rootScope', function (User, Score, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fixture: '=',
      onPredict: '=',
      isOpen: '='
    },
    templateUrl : 'templates/footcard.html',
    link: function (scope, iElement, iAttrs) {
      scope.title = iAttrs.title;
      scope.othersBet = false;
      // Replace Paris Saint-Germain to PSG
      var init = function(){
        scope.fixture.awayTeamName = scope.fixture.awayTeamName.replace("Paris Saint-Germain", "PSG");
        scope.fixture.homeTeamName = scope.fixture.homeTeamName.replace("Paris Saint-Germain", "PSG");
        scope.fixture.awayTeamName = scope.fixture.awayTeamName.replace("FC Girondins de Bordeaux", "Bordeaux");
        scope.fixture.homeTeamName = scope.fixture.homeTeamName.replace("FC Girondins de Bordeaux", "Bordeaux");
        scope.fixture.datePrint = (new Date(scope.fixture.date)).toLocaleString();
        scope.predictHome =  scope.predictAway = "";
        
        scope.matchId = scope.fixture._links.self.href.split('/').pop();
        scope.prono = _.findWhere($rootScope.user.predictions, {matchId: scope.matchId});
        scope.isPredicted = !!scope.prono;
        scope.matchScore = 0;
        if(scope.isPredicted && scope.fixture.status === 'FINISHED'){
          scope.matchScore = Score.getMatchScore(scope.fixture, scope.prono);
        }
      }

      init();
      
      scope.predict = function(predictHome, predictAway){
        var userId = $rootScope.user._id;
        User.predict(userId, scope.matchId, predictHome, predictAway)
          .then(function(data){
            $rootScope.user.predictions = data.data.predictions;
            scope.prono = _.findWhere($rootScope.user.predictions, {matchId: scope.matchId});
            scope.isPredicted = !!scope.prono;
            if(scope.onPredict){
              scope.fixture = scope.onPredict(predictHome, predictAway);
              init();
            }
          }, 
          function(err){
            console.log(err);
          });
      }


      scope.toggleOthers = function(){
        scope.othersBet = !scope.othersBet;
        if(scope.othersBet){
          Score.usersBet(scope.matchId, $rootScope.users)
            .then(function(data){
              scope.usersPrediction = data.data;
              $rootScope.users = data.users;  
            });
        }
      }
      scope.deletePrediction = function(id){
        var userId = $rootScope.user._id;
        User.deletePrediction(userId, id)
          .then(function(data){
            $rootScope.user.predictions = data.data.predictions;
            scope.prono = _.findWhere($rootScope.user.predictions, {matchId: scope.matchId});
            scope.isPredicted = !!scope.prono;
          }, 
          function(err){
            console.log(err);
          });

      }
    }
  };
}])