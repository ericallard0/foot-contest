angular.module('FootCardDirective', [])
.directive('footCard', ['User', '$rootScope', function (User, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl : '/templates/footcard.html',
    link: function (scope, iElement, iAttrs) {
      scope.isOpen = false;
      var matchId = scope.fixture._links.self.href.split('/').pop();
      scope.prono = _.findWhere($rootScope.user.predictions, {matchId: matchId});
      scope.isPredicted = !!scope.prono;
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
    }
  };
}])