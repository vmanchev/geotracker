geoApp.service('I18nService', function ($translate) {

    this.getAvailableLanguages = function () {

        var availableLanguages = [];

        //get available languages
        angular.forEach(TRANSLATIONS, function (keys, id) {
            availableLanguages.push({
                id: id,
                name: keys.name
            });
        });

        return availableLanguages;

    };

    this.setPreferedLanguage = function (selectedLanguage) {
        localStorage.setItem("locale", JSON.stringify(selectedLanguage));
        $translate.use(selectedLanguage.id)
    }

})