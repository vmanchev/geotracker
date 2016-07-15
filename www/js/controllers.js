angular.module('starter.controllers', [])

        .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        })

        .controller('TrackController', function ($scope, $cordovaGeolocation) {
            //has tracking been started or not
            $scope.isTracking = false;

            //container for geo location points
            $scope.points = [];

            //has watcher been started or not
            $scope.trackWatch = null;

            $scope.trackId = (new Date()).toTimeString();

            //start tracking
            $scope.startTracking = function () {

                $scope.isTracking = true;

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
                $scope.getMap(data.coords.latitude, data.coords.longitude);
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

            //display position on the map
            $scope.getMap = function (latitude, longitude) {

                var mapOptions = {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 1,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                map = new google.maps.Map
                        (document.getElementById("map"), mapOptions);


                var latLong = new google.maps.LatLng(latitude, longitude);

                var marker = new google.maps.Marker({
                    position: latLong
                });

                marker.setMap(map);
                map.setZoom(15);
                map.setCenter(marker.getPosition());
            }

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
                
                $scope.saveHistory();
                
                $scope.points = [];
            }

            $scope.saveHistory = function () {
                var historyTracks = localStorage.getItem("tracks");
                
                if (!historyTracks) {
                    historyTracks = [];
                }else{
                    historyTracks = JSON.parse(historyTracks);
                }

                historyTracks.push({
                    trackId: $scope.trackId,
                    points: $scope.points
                });

                localStorage.setItem("tracks", JSON.stringify(historyTracks));
            }

        })

        .controller('HistoryController', function ($scope) {

            var items = localStorage.getItem('tracks');

            if(!items){
                $scope.items = [];
            }else{
                $scope.items = JSON.parse(items);
            }

        });
