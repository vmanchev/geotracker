ctrl.controller('TrackController', function ($rootScope, $scope, $state, $ionicLoading, $cordovaGeolocation, JsMapsService, NativeMapsService, TrackStorage, requiredMapType) {

    var mapSelector = 'map';

    var mapService = (requiredMapType === 'js') ? JsMapsService : NativeMapsService;

    //has tracking been started or not
    $scope.isTracking = false;
    $scope.readyToSave = false;
    $scope.initPoint = {};

    //map scale ratio, see app.js
    $rootScope.mapScreenScale = 0.8;

    /**
     * Start a new track
     * 
     * When the "Start" button is clicked, we will first try to get the current 
     * position and in case of success, will broadcast the "tracking:started" 
     * event along with the location data.
     * 
     * @todo In case of an error, show a proper message.
     * @returns {undefined}
     */
    $scope.startTracking = function () {

        $scope.startTime = new Date();

        $ionicLoading.show();

        $cordovaGeolocation.getCurrentPosition({
            timeout: 30000,
            enableHighAccuracy: true,
            maximumAge: 10000
        }).then(function (locationData) {
            $scope.$broadcast('tracking:started', locationData);
        }, $scope.positionError)
                .finally(function () {
                    $ionicLoading.hide();
                });
    }

    /**
     * Track success callback
     * 
     * Will be called on position change. Actions to be performed: 
     * 1. Collect the position data
     * 2. Call the watchTracking function, if the watcher hasn't been started yet.
     * 3. Call the updateMap function to add a new marker.
     * 
     * @param {object} data
     * @returns {undefined} Object with two keys - timestamp and coords. Coords 
     * itself is an object with two keys - latitiude and longitude. 
     * 
     * @example 
     * {
     *  timestamp: data.timestamp,
     *  coords: {
     *      latitude: data.coords.latitude,
     *      longitude: data.coords.longitude
     *  }
     * }
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
            timeout: 30000,
            frequency: 10000,
            enableHighAccuracy: true// may cause errors if true
        });

        $scope.trackWatch.then(null, function (error) {

            $scope.positionError(error);

            //restarting the watcher
            $scope.trackWatch.clearWatch();
            $scope.watchTracking();

        }, function (data) {
            $scope.positionSuccess(data);
        });

    }

    //display position on the map
    $scope.updateMap = function (latitude, longitude) {
        $scope.map = mapService.addMarker(
                $scope.map,
                latitude,
                longitude
                );
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

    /**
     * Listener for the tracking:started event
     * 
     * When this event is captured, it means the tracking has been started 
     * successfully and we have the current position. Actions to be performed: 
     * 1. Call the MapService to initialize the map. 
     * 2. Set the initial states of all supporting variables. 
     * 3. Call the positionSuccess function.
     */
    $scope.$on('tracking:started', function (event, data) {

        $scope.initPoint = data;

        mapService.initMap(mapSelector, {
            point: $scope.initPoint.coords,
            zoom: 16
        }).then(function (map) {

            $scope.map = map;

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

            $scope.positionSuccess($scope.initPoint);

            $scope.initPoint = {};
        });

    });

    /**
     * Stop button listener
     * 
     * When the "Stop" button is clicked, it means the user is at their destination 
     * and are ready to save the track. Actions to be performed:
     * 
     * 1. Hide the start/stop buttons at the top.
     * 2. Allow the user to optionally add title and description.
     * 3. show the save button
     * 
     * Please note, at this point the information is not saved! It's still in 
     * the current scope.
     */
    $scope.$on('tracking:stopped', function () {
        $scope.readyToSave = true;
    });

    /**
     * Save button listener
     * 
     * The track information has already been saved in the data store. Now do 
     * the chore: 
     * 1. Destroy the map
     * 2. Reset the points array to an empty one.
     * 3. Switch some flags.
     * 4. Navigate to the History page
     */
    $scope.$on('tracking:saved', function (event, data) {

        $scope.map = mapService.remove($scope.map, mapSelector);

        $scope.points = [];
        $scope.readyToSave = false;

        $state.go('app.history');
    });

});