// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var geoApp = angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'pascalprecht.translate'])

        .run(function ($ionicPlatform, $rootScope, SettingsService) {
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

                $rootScope.loadScript = function (url, type, charset) {
                    if (type === undefined)
                        type = 'text/javascript';
                    if (url) {
                        var script = document.querySelector("script[src*='" + url + "']");
                        if (!script) {
                            var heads = document.getElementsByTagName("head");
                            if (heads && heads.length) {
                                var head = heads[0];
                                if (head) {
                                    script = document.createElement('script');
                                    script.setAttribute('src', url);
                                    script.setAttribute('type', type);
                                    if (charset)
                                        script.setAttribute('charset', charset);
                                    head.appendChild(script);
                                }
                            }
                        }
                        return script;
                    }
                };

                $rootScope.$watch('apikey', function(newValue){
                    $rootScope.loadScript('https://maps.googleapis.com/maps/api/js?key=' + newValue);
                });

                $rootScope.apikey = SettingsService.get().apikey;


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
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/track-view.html',
                                controller: 'TrackViewController'
                            }
                        }
                    })

                    .state('app.trackedit', {
                        url: '/track/edit/:trackId',
                        cache: false,
                        views: {
                            'menuContent': {
                                templateUrl: 'templates/track-edit.html',
                                controller: 'TrackEditController'
                            }
                        }
                    })

                    .state('app.settings', {
                        url: '/settings',
                        cache: false,
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
