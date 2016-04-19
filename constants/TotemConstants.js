'use strict';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        LOCATION_UPDATED: null,
        USER_SAVE: null,
        USER_DELETE: null,
        ERROR: null,
        PLACES_FETCH_SUCCEEDED: null,
        PLACES_FETCH_FAILED: null,
        PLACES_NEARBY_REQUESTED: null,
        PLACE_CREATE_REQUESTED: null,
        PLACE_CREATE_SUCCEEDED: null,
    })
};
