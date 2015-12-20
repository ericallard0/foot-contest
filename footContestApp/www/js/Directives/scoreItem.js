angular.module('ScoreItemDirective', ['highcharts-ng'])
.directive('scoreItem', ['User', 'Score', '$rootScope', function (User, Score, $rootScope) {
  return {
    restrict: 'E',
    replace: true,
    template :[       
      '<li class="item score-person" ng-click="open = !open">',
        '{{person.username}}',
        '<span class="item-note">{{person.score}}</span>',
        '<score-chart ng-if="open" user-data="[]"></score-chart>',
      '</li>'].join(''),
    link: function (scope, iElement, iAttrs) {
      scope.open = false;
    }
  }
}]);