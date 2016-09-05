var geoApp = angular.module('toxic.geotracker', ['ionic', 'starter.controllers', 'ngCordova', 'pascalprecht.translate'])

        .run(function ($ionicPlatform, $rootScope, $timeout, SettingsService) {
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

                $rootScope.apikey = SettingsService.get().apikey;

                // Find matches
                var mql = window.matchMedia("(orientation: portrait)");

                // If there are matches, we're in portrait
                if (mql.matches) {
                    // Portrait orientation
                } else {
                    // Landscape orientation
                }

                // Add a media query change listener
                mql.addListener(function (m) {
                    if (m.matches) {
                        /**
                         * Changed to portrait
                         * 
                         * This is the app default orientation. Google Map should 
                         * be displayed with its initial height.
                         */
                        $timeout(function () {
                            angular.element(document.getElementById('map')).css('height', 'initial');
                            google.maps.event.trigger($rootScope.map, 'resize');
                        });
                    } else {
                        /**
                         * Changed to landscape
                         * 
                         * Change Google Map container height by using the device 
                         * screen height and mapScreenScale, which is defined on 
                         * per controller basis. 
                         */
                        $timeout(function () {
                            angular.element(document.getElementById('map')).css('height', (screen.height * $rootScope.mapScreenScale) + 'px');
                            google.maps.event.trigger($rootScope.map, 'resize');
                        });
                    }
                });

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
                        resolve: {
                            track: function ($stateParams, TrackStorage) {
                                return TrackStorage.getById($stateParams.trackId);
                            }
                        },
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
        })
        .filter('mapsUrl', function ($sce) {
            return function (apikey) {
                
                var url = 'https://maps.googleapis.com/maps/api/js';

                if(_.isUndefined(apikey)){
                    return $sce.trustAsResourceUrl(url);
                }else{
                    return $sce.trustAsResourceUrl(url + '?key=' + apikey);
                }
            };
        });

var ctrl = angular.module('starter.controllers', []);