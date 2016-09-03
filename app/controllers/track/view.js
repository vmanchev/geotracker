ctrl.controller('TrackViewController', function ($scope, $state, $stateParams, $ionicPopup, $translate, TrackStorage) {

    $scope.track = TrackStorage.getById($stateParams.trackId);

    $scope.formattedDuration = TrackStorage.formatDuration($scope.track.duration);

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
                $scope.deleteTrack();
            }
        });
    };


    //@todo - needs a confirmation dialog
    $scope.deleteTrack = function () {
        TrackStorage.delete($scope.track);
        $state.go('app.history');
    }
});