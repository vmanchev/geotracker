ctrl.controller('SettingsController', function ($rootScope, $scope, mapTypes, availableLanguages, settings, SettingsService) {

    //options for map type dropdown
    $scope.mapTypes = mapTypes;
    
    //options for languages dropdown
    $scope.availableLanguages = availableLanguages;
    
    //make the settings available in the view
    $scope.settings = settings;

    /**
     * If the locale change, emit an event and pass the data, so the app interface 
     * can be translated immediately. There is a listener in the .run() method.
     */
    $scope.$watch('settings.locale', function(newLocale){
        $rootScope.$emit('locale-changed', newLocale);
    });

    //Settings will be updated onblur or on page leave (which is blur again)
    $scope.$watch('settings', function(newSettings){
        SettingsService.set(newSettings);
    }, true);

});