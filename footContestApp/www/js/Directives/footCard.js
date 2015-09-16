angular.module('FootCardDirective', [])
.directive('footCard', [function () {
  return {
    restrict: 'E',
    link: function (scope, iElement, iAttrs) {
      scope.isOpen = false;
    },
    replace: true,
    templateUrl : '/templates/footcard.html'
  };
}])