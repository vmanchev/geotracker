// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'pascalprecht.translate'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
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

                    .state('app.track', {
                        url: '/track',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/track.html',
                                controller: 'TrackController'
                            }
                        }
                    })

                    .state('app.history', {
                        url: '/history',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/history.html',
                                controller: 'HistoryController'
                            }
                        }
                    })

                    .state('app.trackview', {
                        url: '/track/:trackId',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/track-view.html',
                                controller: 'TrackViewController'
                            }
                        }
                    })
                    
                    .state('app.settings', {
                        url: '/settings',
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/settings.html',
                                controller: 'SettingsController'
                            }
                        }
                    });
                    
            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/app/track');
        })

        .config(function ($translateProvider) {
            $translateProvider.translations('en', TRANSLATIONS.en);
            $translateProvider.translations('bg', TRANSLATIONS.bg);
            
            $translateProvider.useSanitizeValueStrategy('escape');
            
            var selectedLanguage = JSON.parse(localStorage.getItem("locale"));

            var useLanguage = (!_.isNull(selectedLanguage)) ? selectedLanguage.id : 'bg';
            
            $translateProvider.preferredLanguage(useLanguage);
        });
