// Ionic Taxis App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'taxis' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'taxis.controllers' is found in controllers.js
angular.module('taxis', ['ionic'
            , 'taxis.controllers'
            , 'taxis.services'
            , 'taxis.factories'
])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
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

        .config(function ($stateProvider, $urlRouterProvider) {
            $stateProvider

                    .state('app', {
                        url: '/app',
                        abstract: true,
                        templateUrl: 'templates/menu.html',
                        controller: 'AppCtrl'
                    })

                    .state('app.search', {
                        url: '/search',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/search.html'
                            }
                        }
                    })

                    .state('app.browse', {
                        url: '/browse',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/browse.html',
                                controller: 'BrowseCtrl'
                            }
                        }
                    })
                    .state('app.accounts', {
                        url: '/accounts',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/accounts.html',
                                controller: 'AccountsCtrl'
                            }
                        }
                    })

                    .state('app.single', {
                        url: '/playlists/:playlistId',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/playlist.html',
                                controller: 'PlaylistCtrl'
                            }
                        }
                    });
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/accounts');
        });
