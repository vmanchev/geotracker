var geoApp = angular.module('toxic.geotracker', ['ionic', 'starter.controllers', 'ngCordova', 'pascalprecht.translate'])

        .run(function ($ionicPlatform, $rootScope, $timeout, $translate, SettingsService) {
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

                var settings = SettingsService.get();

                $rootScope.apikey = settings.apikey;
                
                $rootScope.$on('locale-changed', function(event, locale){
                    $translate.use(locale.id);
                });

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
        .provider('settingsService', function settingsServiceProvider() {
            this.$get = function() {
                return new SettingsService();
            };            
            return this;
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
                        resolve: {
                            mapTypes: function (SettingsService) {
                                return SettingsService.getMapTypes();
                            },
                            availableLanguages: function (I18nService) {
                                return I18nService.getAvailableLanguages();
                            },
                            settings: function (SettingsService) {
                                return SettingsService.get();
                            }
                        },
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
            
            //we are not able to use the SettingsService at this point
            //hint: custom SettingsService provider?
            var settings = JSON.parse(localStorage.getItem('settings'));
            
            var locale = (!_.isEmpty(settings)) ? settings.locale : config.defaults.locale
            
            $translateProvider.preferredLanguage(locale.id);
        })
        .filter('mapsUrl', function ($sce) {
            return function (apikey) {
                if (_.isUndefined(apikey)) {
                    return $sce.trustAsResourceUrl(config.maps.js);
                } else {
                    return $sce.trustAsResourceUrl(config.maps.js + '?key=' + apikey);
                }
            };
        });

var ctrl = angular.module('starter.controllers', []);