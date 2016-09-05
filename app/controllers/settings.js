ctrl.controller('SettingsController', function ($rootScope, $scope, $translate, $timeout, I18nService, SettingsService) {

    $scope.availableLanguages = I18nService.getAvailableLanguages();
    $scope.settings = SettingsService.get();

    $scope.selectedLanguage = JSON.parse(localStorage.getItem("locale"));

    $scope.setPreferedLanguage = function (selectedLanguage) {
        I18nService.setPreferedLanguage(selectedLanguage);
    }

    $scope.saveSettings = function () {
        SettingsService.set($scope.settings);
        $scope.settings = SettingsService.get();
    }

});