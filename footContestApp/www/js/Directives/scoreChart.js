angular.module('ScoreChartDirective', ['highcharts-ng'])
.directive('scoreChart', ['Foot', 'User', 'Score', '$rootScope', function (Foot, User, Score, $rootScope) {
  return {
    restrict: 'E',
    template : '<div ng-if="loaded"><canvas id="line" class="chart chart-line" data="data" colours="colours" labels="labels" legend="true" series="series" options="{showTooltips: false}"></canvas></div>',
    link: function (scope, iElement, iAttrs) {
      scope.loaded = false;
      scope.colours = ["green", "blue"]
      scope.scoreDataPromise.then(function(){
        var data = _.findWhere(scope.scoreData.results, {name: scope.person.username});
        var currentUserData = _.findWhere(scope.scoreData.results, {name: $rootScope.user.username});

        scope.series = [scope.person.username];
        scope.data = [data.userResults];

        if($rootScope.user.username !== scope.person.username){
          scope.data.push(currentUserData.userResults)
          scope.series.push($rootScope.user.username)
        }
        else{
          scope.data.push(data.globalResults)
          scope.series.push('Average')
        }

        scope.labels = Array(scope.data[0].length).join(".").split("."); //empty string array
        scope.loaded = true;
      });
      
    }
  };
}]);