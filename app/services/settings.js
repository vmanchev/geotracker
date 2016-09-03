geoApp.service('SettingsService', function ($translate) {

    var defaults = {
        apikey: "AIzaSyD8JvJ-krHO-x3ZU6It0rf_wOM2hK3KY4k"
    }

    this.get = function () {
        return _.defaults(JSON.parse(localStorage.getItem('settings')), defaults);
    };

    this.set = function (data) {
        var data = _.omitBy(data, function (value) {
            return _.isEmpty(value);
        });

        data = _.defaults(data, defaults);

        localStorage.setItem("settings", JSON.stringify(data));
    }

});