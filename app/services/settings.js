geoApp.service('SettingsService', function ($translate) {

    this.get = function () {
        return JSON.parse(localStorage.getItem('settings')) || {};
    };

    this.set = function (data) {
        var data = _.omitBy(data, function (value) {
            return _.isEmpty(value);
        });

        localStorage.setItem("settings", JSON.stringify(data));
    }
    
    this.getMapTypes = function () {

        var mapTypes = [];

        //get available languages
        angular.forEach(config.maps.types, function (name, id) {
            
            console.log($translate.instant(name))
            
            this.push({
                id: id,
                name: $translate.instant(name)
            });
        }, mapTypes);

        return mapTypes;

    };    

});