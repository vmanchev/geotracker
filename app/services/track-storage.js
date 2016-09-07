geoApp.factory('TrackStorage', function ($translate) {

    /**
     * Key name to store the tracks under in localStorage
     * @type String
     */
    var key = 'tracks';

    /**
     * Service object
     * 
     * The service object holds all the public methods
     * 
     * @type object
     */
    var ts = {};

    /**
     * Get all the tracks
     * 
     * @returns {Array} In  case there are no tracks, an empty array will be returned
     */
    ts.getAll = function () {

        var serializedTracks = _get();

        return (_.isNull(serializedTracks)) ? [] : JSON.parse(serializedTracks);
    };

    /**
     * Get a track by id
     * 
     * @param {integer} id
     * @returns {object}
     */
    ts.getById = function (id) {
        return _.find(ts.getAll(), {trackId: parseInt(id)});
    };

    /**
     * Save track
     * 
     * Add a new track or update an existing one. 
     * 
     * If there are no tracks in the storage (this is the first one), add the new 
     * track to the empty tracks array. 
     * 
     * If it is a new track, it will be added to the beginning of the tracks array. 
     * This will help us later to avoid sorting, when we need to show the list 
     * of tracks - newer tracks will automatically appear at the top :)
     * 
     * In case there are some tracks in the storage, try to lookup the track by 
     * its trackId property. If the passed track object does not exists in the 
     * tracks array, add the new one at the end. If the passed track object does 
     * exists at the tracks array, find its index and replace the value.
     * 
     * If the index parameter was set, we will replace the track object under 
     * that index.
     * 
     * @param {object} track Track object to save
     * @param {Integer|undefined} idx Index to update
     */
    ts.save = function (track) {

        var tracks = ts.getAll();

        var query = {trackId: track.trackId};

        var isExisting = (_.find(tracks, query)) ? true : false;

        if (_.isEmpty(tracks) || (!_.isEmpty(tracks) && !isExisting)) {
            //empty tracks array or a new track
            tracks.unshift(track);
        }else if (!_.isEmpty(tracks) && isExisting) {
            //existing track to be updated
            var idx = _.findIndex(tracks, query);
            tracks[idx] = track;
        }

        _set(tracks);
    };

    /**
     * Delete the selected track
     * 
     * Get all tracks and identify the one to be deleted by the trackId property, 
     * then update the storage.
     * 
     * @param {object} track
     */
    ts.delete = function (track) {

        var tracks = ts.getAll();

        _.remove(tracks, function (t) {
            return t.trackId === track.trackId;
        });

        _set(tracks);
    };

    ts.formatDuration = function (duration) {
        return moment.duration(duration, "seconds")
                .format("Y [" + $translate.instant('time.year') + "], M [" + $translate.instant('time.month') + "], D [" + $translate.instant('time.day') + "], h [" + $translate.instant('time.hour') + "], m [" + $translate.instant('time.minute') + "], s [" + $translate.instant('time.second') + "]");
    };

    ts.formatPointTime = function (duration) {
        return moment.duration(duration, "seconds")
                .format("h:mm:ss", {trim: false});
    };

    /**
     * Get track points
     * 
     * Loop over the track points and transform it to the format, required 
     * by Google Maps for Polyline
     * 
     * @returns {array} Array of objects with two keys - lat and lng
     */
    ts.getPolylinePoints = function (points) {

        var filtered = [];

        angular.forEach(points, function (point) {
            this.push({lat: point.coords.latitude, lng: point.coords.longitude});
        }, filtered);

        return filtered;
    };

    ts.getChartData = function (track, key) {

        var chartData = {key: key, values: []};

        angular.forEach(track.points, function (point) {
            
            var tmpKey = parseFloat(point.coords[key]);
            
            if(!_.isUndefined(point.timestamp) && !isNaN(tmpKey) && key === 'speed' && tmpKey >= 0){
                
            }else if (!_.isUndefined(point.timestamp) && !isNaN(tmpKey)) {
                this.push({x:point.timestamp, y:tmpKey});
            }
            
        }, chartData.values);

        return chartData;
    };
    
    ts.getAverageSpeed = function(track){
        
        var data = [];

        angular.forEach(track.points, function (point) {

            if (!_.isUndefined(point.coords.speed) && point.coords.speed > 0) {
                this.push(parseFloat(point.coords.speed));
            }
        }, data);

        return (_.isEmpty(data)) ? 0 : _.mean(data).toFixed(2);
        
    };
    
    ts.getDisplacement = function(track){
        
        var data = [];

        angular.forEach(track.points, function (point) {
            //temp var to avoid  altitude casting twice
            var tmpAltitude = parseFloat(point.coords.altitude);
            
            if (!isNaN(tmpAltitude)) {
                this.push(tmpAltitude);
            }
        }, data);

        return (_.isEmpty(data)) ? 0 : (_.max(data) - _.min(data)).toFixed(2);
        
    }
    

    /**
     * Write to local storage
     * 
     * Private method to write data to the local storage under the service key.
     * 
     * @param {object} value Object to be serialized and written as JSON string
     */
    var _set = function (value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    /**
     * Read from local storage
     * 
     * Read the data from local storage under the service key
     * 
     * @returns {DOMString}
     */
    var _get = function () {
        return localStorage.getItem(key);
    };

    return ts;

});