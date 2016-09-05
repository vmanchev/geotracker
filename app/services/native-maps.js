geoApp.factory('NativeMapsService', function ($rootScope, $q) {

    var ms = {};

    ms.initMap = function (selector, cameraOptions) {

        var deferred = $q.defer();

        // Getting the map selector in DOM
        var map_container = document.getElementById(selector);

        if (!_.isUndefined(cameraOptions.point) && !_.isUndefined(cameraOptions.point.latitude) && !_.isUndefined(cameraOptions.point.longitude)) {
            cameraOptions.latLng = ms.setPosition(cameraOptions.point.latitude, cameraOptions.point.longitude);
            delete cameraOptions.point;
        }

        if (_.isUndefined(cameraOptions.zoom)) {
            cameraOptions.zoom = 10;
        }

        // Invoking Map using Google Map SDK v2 by dubcanada
        var map = plugin.google.maps.Map.getMap(map_container, {
            camera: cameraOptions
        });

        //@see MenuController
        $rootScope.$on('sidemenu:on', function () {
            map.setClickable(false);
        });

        //@see MenuController
        $rootScope.$on('sidemenu:off', function () {
            map.setClickable(true);
        });

        // Capturing event when Map load are ready.
        map.addEventListener(plugin.google.maps.event.MAP_READY, function (map) {
            deferred.resolve(map);
        });
        
         return deferred.promise;
    };


    // Function that return a LatLng Object to Map
    ms.setPosition = function (lat, lng) {
        return new plugin.google.maps.LatLng(lat, lng);
    };

    /**
     * Get track points
     * 
     * Loop over the track points and transform it to the format, required 
     * by Google Maps 
     * 
     * Use this method when the app is compiled with the native maps plugin. 
     * 
     * @returns {array} Array of objects with two keys - lat and lng
     */
    ms.getPolylinePoints = function(points){

        var filtered = [];
        
        angular.forEach(points, function(point){
            this.push(ms.setPosition(point.coords.latitude, point.coords.longitude));
        }, filtered);

        return filtered;
    }


    return ms;

});