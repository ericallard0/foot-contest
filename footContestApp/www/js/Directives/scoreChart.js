angular.module('ScoreChartDirective', ['highcharts-ng'])
.directive('scoreChart', ['User', 'Score', '$rootScope', function (User, Score, $rootScope) {
  return {
    restrict: 'E',
    template : '<highchart id="chart1" config="chartConfig1" style="height:200px;"></highchart>',
    link: function (scope, iElement, iAttrs) {
      scope.chartConfig1 = {
        options: {
          chart: {
            type: 'areaspline',
            zoomType: 'y',
            height: 200
          },
          legend:{
            enabled: false,
            style: {
              display: 'none'
            }
          }
        },

        title: {
          text: null,
        },
  
        loading: false,

        series: []
      };

      Score.mapResults(scope.person.predictions)
        .then(function(r){
          var i = 0;
          var serie = r.map(function(e){
            return [i++, e.result];
          });
          scope.chartConfig1.series.push({
            data: serie
          });
        });

    }
  };
}]);