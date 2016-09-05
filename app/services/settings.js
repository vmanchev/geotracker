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

});