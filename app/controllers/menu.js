ctrl.controller('MenuController', function ($rootScope, $scope, $ionicSideMenuDelegate) {
    $scope.$watch(function () {
        return $ionicSideMenuDelegate.isOpenLeft();
    }, function (isOpen) {
        
        /**
         * When the side menu is closed, lets stay hidden!
         * 
         * Silly, but fixes a bug with the native maps plugin
         * 
         * @see https://forum.ionicframework.com/t/using-google-maps-cordova-plugin/4456/80
         * @see https://github.com/mapsplugin/cordova-plugin-googlemaps
         */
        $scope.hideLeft = (isOpen) ? false : true;
        
        /**
         * Events to describe the sidemenu state
         * 
         * Again, because of the way the native maps plugin works, we need to 
         * turn on and off the map area clickable propery. As the sidemenu 
         * does not emit any events, we are doing it here.
         * 
         * Whenever the map is used, subscribe to the "sidemenu:on" event to 
         * turn off the clickable property and to "sidemenu:off" to turn it on.
         * 
         * @see https://github.com/mapsplugin/cordova-plugin-googlemaps
         */
        var sideMenuEvent = (isOpen) ? "sidemenu:on" : "sidemenu:off";
        $rootScope.$emit(sideMenuEvent);

    });
});