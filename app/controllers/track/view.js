ctrl.controller('TrackViewController', function ($rootScope, $scope, $state, $stateParams, $ionicPopup, $translate, $timeout, TrackStorage, SettingsService, track) {

    //track data has already been resolved in the route
    $scope.track = track;

    //human readable track duration
    $scope.formattedDuration = TrackStorage.formatDuration($scope.track.duration);

    //points list, as required by Polyline
    $scope.points = TrackStorage.getPolylinePoints($scope.track.points);

    //map scale ratio, see app.js
    $rootScope.mapScreenScale = 1;

    function initMap(points, mapTypeId) {
        $rootScope.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: (points.length > 3) ? points[Math.ceil(points.length/2)] : points[0],
            mapTypeId: mapTypeId
        });

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
            map: $rootScope.map
        });
    };

    $timeout(function(){
       initMap($scope.points, 'terrain'); 
    });
    

    //Confirmation dialog in case the user clicks on the delete button
    $scope.confirmDelete = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant("dialog.confirm"),
            template: $translate.instant("dialog.track.confirm"),
            cancelText: $translate.instant("common.cancel"),
            cancelType: 'button-positive',
            okText: $translate.instant("common.yes"),
            okType: 'button-default'
        });

        confirmPopup.then(function (res) {
            if (res) {
                TrackStorage.delete($scope.track);
                $state.go('app.history');
            }
        });
    };
});