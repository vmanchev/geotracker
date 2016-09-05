ctrl.controller('TrackViewController', function ($rootScope, $scope, $state, $ionicPopup, $translate, $timeout, JsMapsService, NativeMapsService, TrackStorage, track, requiredMapType) {

    var mapSelector = 'map';

    var mapService = (requiredMapType === 'js') ? JsMapsService : NativeMapsService;

    //track data has already been resolved in the route
    $scope.track = track;

    //human readable track duration
    $scope.formattedDuration = TrackStorage.formatDuration($scope.track.duration);

    //points list, as required by Polyline
    var points = TrackStorage.getPolylinePoints($scope.track.points);

    //map scale ratio, see app.js
    $rootScope.mapScreenScale = 1;

    $timeout(function () {
        mapService.initMap(mapSelector, {
            point: (points.length > 3) ? points[Math.ceil(points.length/2)] : points[0],
            zoom: 16
        }).then(function (map) {

            $scope.map = map;
            
            $scope.map = mapService.addPolyline($scope.map, points);

        });
    }, 1000);

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