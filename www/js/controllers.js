angular.module('starter.controllers', [])

        .controller('AppCtrl', function () {

        })

        .controller('TrackController', function ($scope, $timeout, $cordovaGeolocation) {
            //has tracking been started or not
            $scope.isTracking = false;
            $scope.readyToSave = false;

            //start tracking
            $scope.startTracking = function () {

                $scope.$broadcast('tracking:started');

                $cordovaGeolocation.getCurrentPosition({
                    timeout: 10000,
                    enableHighAccuracy: true,
                    maximumAge: 3000
                }).then($scope.positionSuccess, $scope.positionError);
            }

            /**
             * Track success callback
             * 
             * Will be called on position change
             * 
             * @param {type} data
             * @returns {undefined}
             */
            $scope.positionSuccess = function (data) {

                //add the new point to the array of points
                $scope.points.push(data);

                //if watcher hasn't been started yet, start it now
                if (!$scope.trackWatch) {
                    $scope.watchTracking();
                }

                //show position on the map
                $scope.updateMap(data.coords.latitude, data.coords.longitude);
            }

            //error callback
            $scope.positionError = function (error) {
                console.log("error", error)
            }

            /**
             * Position change track
             * 
             * Will track new position change every 3 seconds
             * 
             * @returns {undefined}
             */
            $scope.watchTracking = function () {

                $scope.trackWatch = $cordovaGeolocation.watchPosition({
                    timeout: 3000,
                    enableHighAccuracy: false // may cause errors if true
                });

                $scope.trackWatch.then(null, $scope.positionError, $scope.positionSuccess);

            }

            /**
             * Initialize map
             */
            $scope.initMap = function () {
                var mapOptions = {
                    zoom: 1,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                $timeout(function () {
                    $scope.map = new google.maps.Map
                            (document.getElementById("map"), mapOptions);
                });

            }

            //display position on the map
            $scope.updateMap = function (latitude, longitude) {

                if (angular.isUndefined($scope.map)) {
                    $scope.initMap();
                }

                var latLong = new google.maps.LatLng(latitude, longitude);

                var marker = new google.maps.Marker({
                    position: latLong
                });

                marker.setMap($scope.map);
                $scope.map.setZoom(15);
                $scope.map.setCenter(marker.getPosition());
            }

            $scope.resetMap = function () {
                //Find the map DOM element
                var mapElement = document.getElementById('map');

                //remove the html code
                mapElement.innerHTML = '';

                //remove the inline style
                mapElement.removeAttribute("style");

                //reset our internal map reference
                $scope.map = null;
            };

            /**
             * Stop tracking
             * 
             * 1. Save the current track in the history
             * 2. Stop the watcher
             * 3. Clear the points array
             * 
             * @returns {undefined}
             */
            $scope.stopTracking = function () {
                $scope.isTracking = false;
                $scope.trackWatch.clearWatch();

                $scope.$broadcast('tracking:stopped');
            }

            $scope.saveHistory = function () {
                var historyTracks = localStorage.getItem("tracks");

                if (!historyTracks) {
                    historyTracks = [];
                } else {
                    historyTracks = JSON.parse(historyTracks);
                }

                historyTracks.push({
                    trackId: $scope.trackId,
                    points: $scope.points,
                    info: _.omitBy($scope.trackInfo, function (value, key) {
                        return _.isEmpty(value);
                    })
                });

                localStorage.setItem("tracks", JSON.stringify(historyTracks));

                $scope.$broadcast('tracking:saved');
            }

            $scope.$on('tracking:started', function (event, data) {

                $scope.isTracking = true;

                //container for geo location points
                $scope.points = [];

                //has watcher been started or not
                $scope.trackWatch = null;

                $scope.trackId = (new Date()).getTime();

                $scope.trackInfo = {
                    title: null,
                    notes: null
                };

                $scope.initMap();
            });

            $scope.$on('tracking:stopped', function (event, data) {
                //1. allow the client to optionally add title and description

                //2. show the save button

                $scope.readyToSave = true;
            });

            $scope.$on('tracking:saved', function (event, data) {

                $scope.resetMap();

                $scope.points = [];
                $scope.readyToSave = false;


            });

        })

        .controller('HistoryController', function ($scope) {

            var items = localStorage.getItem('tracks');

            if (!items) {
                $scope.items = [];
            } else {
                $scope.items = JSON.parse(items);
            }

        })

        .controller('TrackViewController', function ($scope, $state, $stateParams) {

            var tracks = JSON.parse(localStorage.getItem('tracks'));

            $scope.track = _.find(tracks, {trackId: parseInt($stateParams.trackId)});

            //@todo - needs a confirmation dialog
            $scope.deleteTrack = function () {
                _.pull(tracks, $scope.track);
                localStorage.setItem("tracks", JSON.stringify(tracks));
                $state.go('app.history');
            }
        })

        .controller('SettingsController', function ($scope, $translate, $timeout) {


            $scope.availableLanguages = [];

            //get available languages
            angular.forEach(TRANSLATIONS, function (keys, id) {
                $scope.availableLanguages.push({
                    id: id,
                    name: keys.name
                });
            });

            $timeout(function () {
                $scope.selectedLanguage = JSON.parse(localStorage.getItem("locale"));
            });

            $scope.setPreferedLanguage = function (selectedLanguage) {
                localStorage.setItem("locale", JSON.stringify(selectedLanguage));
                $translate.use(selectedLanguage.id)
            }

        });
