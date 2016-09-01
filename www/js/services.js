geoApp.factory('TrackStorage', function () {

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

        return (_.isUndefined(serializedTracks)) ? [] : JSON.parse(serializedTracks);
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

        if (_.isEmpty(tracks)) {
            tracks.push(track);
        }else if(!_.isEmpty(tracks) && !isExisting ){
            tracks.push(track);
        }else if(!_.isEmpty(tracks) && isExisting ){
            
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
    
    /**
     * Write to local storage
     * 
     * Private method to write data to the local storage under the service key.
     * 
     * @param {object} value Object to be serialized and written as JSON string
     */
    var _set = function(value){
        localStorage.setItem(key, JSON.stringify(value));
    };
    
    /**
     * Read from local storage
     * 
     * Read the data from local storage under the service key
     * 
     * @returns {DOMString}
     */
    var _get = function(){
        return localStorage.getItem(key);
    };

    return ts;

});