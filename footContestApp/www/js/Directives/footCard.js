angular.module('FootCardDirective', [])
.directive('footCard', ['Foot', 'User', 'Score', '$rootScope', function (Foot, User, Score, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      fixture: '=',
      onPredict: '=',
      isOpen: '=',
      resetOnRefresh: '='
    },
    templateUrl : 'templates/footcard.html',
    link: function (scope, iElement, iAttrs) {
      scope.title = iAttrs.title;
      scope.othersBet = false;
      // Replace Paris Saint-Germain to PSG
      var init = function(){
        scope.fixture.awayTeamName = Foot.translateName(scope.fixture.awayTeamName);
        scope.fixture.homeTeamName = Foot.translateName(scope.fixture.homeTeamName);
        scope.predictHome =  scope.predictAway = "";
        
        scope.matchId = scope.fixture._links.self.href.split('/').pop();
        scope.prono = _.findWhere($rootScope.user.predictions, {matchId: scope.matchId});
        scope.isPredicted = !!scope.prono;
        scope.matchScore = undefined;
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
          Score.usersBet(scope.matchId, $rootScope.users, scope.fixture)
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
      if(scope.resetOnRefresh){
        scope.$watch('fixture', init);
      }
    }
  };
}])