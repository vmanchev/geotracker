geoApp.service('SettingsService', function ($translate, I18nService) {

    /**
     * Get app settings
     * 
     * If there are no settings in the local storage (e.g. the app is started 
     * for the first time), set the default settings and make them available.
     * 
     * @returns {object}
     */
    this.get = function () {
        
        var settings = JSON.parse(localStorage.getItem('settings'));

        if(_.isEmpty(settings)){
            settings = this.setDefaults();
        }
        
        return settings;
    };

    /**
     * Set/updates the app settings
     * 
     * @param {object} data Empty properties will be skipped
     */
    this.set = function (data) {
        var data = _.omitBy(data, function (value) {
            return _.isEmpty(value);
        });

        localStorage.setItem("settings", JSON.stringify(data));
    }

    /**
     * Set default app settings
     * 
     * @returns {settings_L1.setDefaults.defaults}
     */
    this.setDefaults = function () {

        var defaults = {
            locale: config.defaults.locale,
            mapType: _.filter(this.getMapTypes(), {id: config.defaults.mapType}).shift(),
            apikey: config.defaults.apikey
        };

        this.set(defaults);
        
        return defaults;
    }

    /**
     * Map types
     * 
     * Retrives an array of the available map types in config.json file. It will 
     * be presented in the app settings to define which map type to be in used - 
     * Javascript or native.
     * 
     * @returns {Array}
     */
    this.getMapTypes = function () {

        var mapTypes = [];

        angular.forEach(config.maps.types, function (name, id) {

            this.push({
                id: id,
                name: $translate.instant(name)
            });
        }, mapTypes);

        return mapTypes;

    };

});