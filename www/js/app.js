// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','ngCordova','autocomplete','ion-floating-menu'])

.run(function($ionicPlatform,$rootScope, User, $location) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})


.config(function($stateProvider, $urlRouterProvider) {
 
  $stateProvider

      .state('sign-up', {
      url: '/sign-up',
        templateUrl: 'templates/sign-up.html',
         controller: 'signUpCtrl'

  })
  
  .state('login', {
    url: '/login',
        templateUrl: 'templates/login.html',
         controller: 'loginCtrl'
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'logoutCtrl'
  })

   .state('app.items', {
      url: '/items',
      views: {
        'menuContent': {
          templateUrl: 'templates/items.html',
          controller: 'itemsCtrl'
        }
      }
    })

  .state('app.item', {
    url: '/items/:itemId',
    views: {
      'menuContent': {
        templateUrl: 'templates/item.html',
        controller: 'itemCtrl'
      }
    }
  })

  .state('app.history', {
      url: '/history',
      views: {
        'menuContent': {
          templateUrl: 'templates/history.html',
          controller: 'historyCtrl'
        }
      }
    })
 
  // if none of the above states are matched, use this as the fallback
 $urlRouterProvider.otherwise('/login');
})

