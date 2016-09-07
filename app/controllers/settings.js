ctrl.controller('SettingsController', function ($rootScope, $scope, mapTypes, availableLanguages, settings, SettingsService) {

    //options for map type dropdown
    $scope.mapTypes = mapTypes;
    
    //options for languages dropdown
    $scope.availableLanguages = availableLanguages;
    
    //make the settings available in the view
    $scope.settings = settings;

    //Settings will be updated onblur or on page leave (which is blur again)
    $scope.$watch('settings', function(newSettings){
        SettingsService.set(newSettings);
        $rootScope.$emit('settings-changed');
    }, true);

});