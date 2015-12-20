angular.module('ScoreChartDirective', ['highcharts-ng'])
.directive('scoreChart', ['Foot', 'User', 'Score', '$rootScope', function (Foot, User, Score, $rootScope) {
  return {
    restrict: 'E',
    template : '<highchart config="chartConfig1" style="height:200px;"></highchart>',
    link: function (scope, iElement, iAttrs) {
      scope.chartConfig1 = {
        options: {
          backgroundColor: '#434343',
          background: '#434343',
          chart: {
            type: 'spline',
            height: 200,
            backgroundColor: '#434343'
          },
          plotOptions:{
            spline:{
              marker:{
                enabled:false,
                fillColor: "black"
              }
            }
          },
          yAxis:{
            tickInterval: 20,
            max: 80,
            title:{
              text: null
            }
          },
          xAxis:{
            labels:{
              enabled: false
            },
            type: 'category',
            title:{
              text: null
            }
          },
          credits: {
            enabled: false
          }
        },

        title: {
          text: null,
        },
        loading: true,
      };

      scope.scoreDataPromise.then(function(){
        var data = _.findWhere(scope.scoreData.results, {name: scope.person.username});
        var currentUserData = _.findWhere(scope.scoreData.results, {name: $rootScope.user.username});
        scope.chartConfig1.series = [
          {
            name: scope.person.username,
            data: data.userResults
          }
        ];
        if($rootScope.user.username !== scope.person.username){
          scope.chartConfig1.series.unshift({
            name: $rootScope.user.username,
            data: currentUserData.userResults            
          });
        }
        else{
          scope.chartConfig1.series.unshift({
            name: 'Average',
            data: data.globalResults
          });
        }
        scope.chartConfig1.loading = false;
      });
      
    }
  };
}]);