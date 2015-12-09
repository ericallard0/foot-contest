angular.module('ScoreChartDirective', ['highcharts-ng'])
.directive('scoreChart', ['Foot', 'User', 'Score', '$rootScope', function (Foot, User, Score, $rootScope) {
  return {
    restrict: 'E',
    template : '<highchart config="chartConfig1" style="height:200px;"></highchart>',
    link: function (scope, iElement, iAttrs) {
      scope.chartConfig1 = {
        options: {
          chart: {
            type: 'spline',
            height: 200
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
            labels:{
              enabled: false
            },
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
        var data = _.findWhere(scope.scoreData.results, {name: scope.person.username})
        scope.chartConfig1.series = [
          {
            name: "result",
            data: data.userResults
          },
          {
            name: 'average',
            data: data.globalResults
          },
        ];
        scope.chartConfig1.loading = false;
      });
      
    }
  };
}]);