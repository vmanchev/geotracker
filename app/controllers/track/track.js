ctrl.controller('TrackController', function ($rootScope, $scope, $state, $ionicLoading, $cordovaGeolocation, $translate, $timeout, TrackStorage) {
    //has tracking been started or not
    $scope.isTracking = false;
    $scope.readyToSave = false;

    //map scale ratio, see app.js
    $rootScope.mapScreenScale = 0.8;

    //start tracking
    $scope.startTracking = function () {

        $scope.startTime = new Date();

        $ionicLoading.show();

        $cordovaGeolocation.getCurrentPosition({
            timeout: 10000,
            enableHighAccuracy: true,
            maximumAge: 3000
        }).then(function (locationData) {
            $scope.$broadcast('tracking:started');
            $scope.positionSuccess(locationData);
        }, $scope.positionError)
                .finally(function () {
                    $ionicLoading.hide();
                });
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

        /**
         * @bug Coordinates object, provided by the browsers, can not be 
         * serialized. During the development process, I can not get 
         * any coordinates into the storage.
         */
//                $scope.points.push({
//                    timestamp: data.timestamp,
//                    coords: {
//                        latitude: data.coords.latitude,
//                        longitude: data.coords.longitude
//                    }
//                });

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
            timeout: 30000,
            frequency: 10000,
            enableHighAccuracy: true // may cause errors if true
        });

        $scope.trackWatch.then(null, function(error){

            $scope.positionError(error);
            
            //restarting the watcher
            $scope.trackWatch.clearWatch();
            $scope.watchTracking();
            
        }, $scope.positionSuccess);

    }

    /**
     * Initialize map
     */
    $scope.initMap = function () {

        if (!_.isUndefined($rootScope.map)) {
            return;
        }

        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $timeout(function () {
            $rootScope.map = new google.maps.Map
                    (document.getElementById("map"), mapOptions);
        })

    }

    //display position on the map
    $scope.updateMap = function (latitude, longitude) {

        if (angular.isUndefined($rootScope.map)) {
            $scope.initMap();
        }

        var latLong = new google.maps.LatLng(latitude, longitude);

        var marker = new google.maps.Marker({
            position: latLong
        });

        $timeout(function () {
            marker.setMap($rootScope.map);
            $rootScope.map.setCenter(marker.getPosition());
        });
    }

    $scope.resetMap = function () {
        //Find the map DOM element
        var mapElement = document.getElementById('map');

        //remove the html code
        mapElement.innerHTML = '';

        //remove the inline style
        mapElement.removeAttribute("style");

        //reset our internal map reference
        $rootScope.map = null;
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
        $scope.endTime = new Date();
        $scope.isTracking = false;
        $scope.trackWatch.clearWatch();

        $scope.$broadcast('tracking:stopped');
    }

    /**
     * Save the current track to the app history
     * 
     * We will call it from the view.
     * 
     * @returns {undefined}
     */
    $scope.saveHistory = function () {

        var track = {
            trackId: $scope.trackId,
            points: $scope.points,
            info: _.omitBy($scope.trackInfo, function (value) {
                return _.isEmpty(value);
            }),
            startTime: $scope.startTime,
            endTime: $scope.endTime,
            duration: moment($scope.endTime).diff(moment($scope.startTime), "seconds")
        };

        TrackStorage.save(track);

        $scope.$broadcast('tracking:saved');
    }

    $scope.$on('tracking:started', function (event, data) {

        $scope.initMap();

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

        $state.go('app.history');
    });

});