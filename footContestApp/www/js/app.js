// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', [
  'ionic',
  'UserFactory',
  'FootFactory',
  'ScoreFactory',
  'FootCardDirective',
  'LoginController',
  'MainController',
  'HomeController',
  'PredictionsController',
  'ScoreController',
  'SettingsController'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.get = { 'X-Auth-Token': '561c5c7ec4914ac99d933970e5cad6b9' };
    }
])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

    .state('register', {
      url: "/register",
      templateUrl: 'templates/register.html',
      controller: 'loginCtrl'
    })

    .state('predictions',{
      url: "/predictions",
      templateUrl: 'templates/predictions.html',
      controller: 'predictionsCtrl'
    })

    .state('score',{
      url: "/score",
      templateUrl: 'templates/score.html',
      controller: 'scoreCtrl'
    })

    .state('settings',{
      url: "/settings",
      templateUrl: 'templates/settings.html',
      controller: 'settingsCtrl'
    })

    .state('home',{
      url: "/home",
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl'
    });

  $urlRouterProvider.otherwise('/home');

});

