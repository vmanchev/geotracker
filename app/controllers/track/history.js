ctrl.controller('HistoryController', function ($scope, TrackStorage) {
    $scope.items = TrackStorage.getAll();
});