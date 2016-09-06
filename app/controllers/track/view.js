ctrl.controller('TrackViewController', function ($rootScope, $scope, $state, $ionicPopup, $translate, $timeout, JsMapsService, NativeMapsService, TrackStorage, track, requiredMapType) {

    var mapSelector = 'map';

    var mapService = (requiredMapType === 'js') ? JsMapsService : NativeMapsService;

    //track data has already been resolved in the route
    $scope.track = track;

    //human readable track duration
    $scope.formattedDuration = TrackStorage.formatDuration($scope.track.duration);

    //points list, as required by Polyline
    var points = TrackStorage.getPolylinePoints($scope.track.points);

    var altitudePoints = TrackStorage.getChartData($scope.track, 'altitude');

    var speedPoints = TrackStorage.getChartData($scope.track, 'speed');
    
    $scope.averageSpeed = TrackStorage.getAverageSpeed($scope.track);
    if($scope.averageSpeed === 0){
        $scope.averageSpeed = $translate.instant('common.na');
    }
    
    $scope.displacement = TrackStorage.getDisplacement($scope.track);
    if($scope.displacement === 0){
        $scope.displacement = $translate.instant('common.na');
    }

    //map scale ratio, see app.js
    $rootScope.mapScreenScale = 1;

    $timeout(function () {
        mapService.initMap(mapSelector, {
            point: (points.length > 3) ? points[Math.ceil(points.length / 2)] : points[0],
            zoom: 16
        }).then(function (map) {

            $scope.map = map;

            $scope.map = mapService.addPolyline($scope.map, points);

        });
    }, 1000);


    /* Chart options */
    $scope.altitudeChartOptions = {
        title: {
            enable: true,
            text: $translate.instant('track.altitude')
        },
        chart: {
            type: 'lineChart',
            height: 250,
            margin: {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            showControls: false,
            showLegend: false,
            useVoronoi: false,
            clipEdge: true,
            duration: 100,
            useInteractiveGuideline: true,
            interactiveLayer: {
                tooltip: {
                    contentGenerator: function (d) {

                        var html = "<ul>";

                        d.series.forEach(function (elem) {
                            
                            var translatedKey = $translate.instant("track." + elem.key);
                            
                            html += "<li style='padding: 5px; color:" + elem.color + "'>"
                                    + translatedKey + " : <b>" + elem.value + "</b></li>";
                        })
                        html += "</ul>"
                        return html;
                    }
                }
            },
            xAxis: {
                showMaxMin: false,
                tickFormat: function (d) {
                    return TrackStorage.formatPointTime((d - $scope.track.trackId) / 1000);
                }
            },
            yAxis: {
                showMaxMin: false,
                tickFormat: function (d) {
                    return d;
                }
            }
        }
    };
    
    $scope.speedChartOptions = angular.copy($scope.altitudeChartOptions);
    $scope.speedChartOptions.title.text = $translate.instant('track.speed');

    /* Chart data */
    $scope.altitudeChartData = [altitudePoints];
    $scope.speedChartData = [speedPoints];

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