geoApp.factory('NativeMapsService', function ($rootScope, $q) {

    var ms = {};

    ms.initMap = function (selector, options) {

        var deferred = $q.defer();

        // Getting the map selector in DOM
        var map_container = document.getElementById(selector);

        //@bug a bit of inconsistency
        if (options && options.point) {
            if (options.point.lat && options.point.lng) { //view track
                options.latLng = ms.setPosition(options.point.lat, options.point.lng);
            } else if (options.point.latitude && options.point.longitude) {    //new track
                options.latLng = ms.setPosition(options.point.latitude, options.point.longitude);
            }

            delete options.point;
        }

        if (_.isUndefined(options.zoom)) {
            options.zoom = 10;
        }

        // Invoking Map using Google Map SDK v2 by dubcanada
        var map = plugin.google.maps.Map.getMap(map_container, {
            camera: options
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
    ms.getPolylinePoints = function (points) {

        var filtered = [];

        angular.forEach(points, function (point) {
            this.push(ms.setPosition(point.coords.latitude, point.coords.longitude));
        }, filtered);

        return filtered;
    };

    /**
     * Add marker to the map
     * 
     * Map will also get cetered at the marker position
     * 
     * @param {object} map Source map
     * @param {float} lat Marker latitude
     * @param {float} lng Marker longitude
     * @returns {object} Updated map
     */
    ms.addMarker = function (map, lat, lng) {

        var position = ms.setPosition(lat, lng);

        map.addMarker({
            'position': position,
            'icon': {
                'url': 'www/img/marker.png',
                size: {
                    width: 10,
                    height: 10
                }
            }
        });

        map.setCenter(position);

        return map;
    };

    /**
     * Removes a map from DOM
     */
    ms.remove = function (map) {

        map.remove();

        //reset our internal map reference
        map = null;

        return map;
    };

    /**
     * Add polyline
     * 
     * For the initial version, a lot of options are hardcoded. These could 
     * easily goes to the configuration file.
     * 
     * @param {object} map Source map
     * @param {array} points Array of points
     * @returns {map} Updated map
     */
    ms.addPolyline = function (map, points) {

        map.addPolyline({
            points: points,
            color: '#990000',
            width: 5
        });

        return map;
    };

    ms.getLicenseInfo = function () {

        var deferred = $q.defer();

        plugin.google.maps.Map.getLicenseInfo(function(v1, v2){
            deferred.resolve(v1 || v2);
        });
        
        return deferred.promise;
    };

    return ms;

});