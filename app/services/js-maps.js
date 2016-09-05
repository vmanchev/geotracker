geoApp.factory('JsMapsService', function ($rootScope, $q, $timeout) {

    var ms = {};

    ms.initMap = function (selector) {

        var deferred = $q.defer();

        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $timeout(function () {
            deferred.resolve(
                    new google.maps.Map(document.getElementById(selector), mapOptions)
                    );
        });

        return deferred.promise;
    };


    // Function that return a LatLng Object to Map
    ms.setPosition = function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
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

    ms.addMarker = function (map, lat, lng) {
        var marker = new google.maps.Marker({
            position: ms.setPosition(lat, lng)
        });

        marker.setMap(map);
        map.setCenter(marker.getPosition());

        return map;
    };

    /**
     * Removes a map from DOM
     */
    ms.remove = function (map, selector) {
        //Find the map DOM element
        var mapElement = document.getElementById(selector);

        //remove the html code
        mapElement.innerHTML = '';

        //remove the inline style
        mapElement.removeAttribute("style");

        //reset our internal map reference
        map = null;

        return map;
    }


    return ms;

});