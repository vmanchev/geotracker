geoApp.factory('JsMapsService', function ($rootScope, $q, $timeout) {

    var ms = {};

    ms.initMap = function (selector, options) {

        var deferred = $q.defer();

        var mapOptions = {
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        //@bug a bit of inconsistency
        if(options && options.point){
            
            if(options.point.lat && options.point.lng){ //view track
                mapOptions.center = {lat: options.point.lat, lng: options.point.lng};
            }else if(options.point.latitude && options.point.longitude){    //new track
                mapOptions.center = {lat: options.point.latitude, lng: options.point.longitude};
            }
            
            
        }

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
    };

    ms.addPolyline = function (map, points) {

        // Define a symbol using SVG path notation, with an opacity of 1.
        var lineSymbol = {
            path: google.maps.SymbolPath.CIRCLE,
            strokeOpacity: 1,
            strokeWeight: 2,
            scale: 4,
            strokeColor: "#990000",
            fillColor: '#ffffff',
            fillOpacity: 1
        };

        // Create the polyline, passing the symbol in the 'icons' property.
        // Give the line an opacity of 0.
        // Repeat the symbol at intervals of 20 pixels to create the dashed effect.
        new google.maps.Polyline({
            path: points,
            strokeOpacity: 0,
            icons: [{
                    icon: lineSymbol,
                    offset: '0',
                    repeat: '20px'
                }],
            map: map
        });

        return map;
    }


    return ms;

});