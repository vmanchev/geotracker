ctrl.controller('TrackEditController', function ($scope, $state, $stateParams, TrackStorage) {

    $scope.track = TrackStorage.getById($stateParams.trackId);

    $scope.updateTrack = function () {
        TrackStorage.save($scope.track);
        $state.go('app.trackview', $stateParams);
    }

});