'use strict';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        LOCATION_UPDATED: null,
        USER_SAVE: null,
        USER_DELETE: null,
        ERROR: null,

        PLACES_NEARBY_REQUESTED: null,
        PLACES_FETCH_SUCCEEDED: null,
        PLACES_FETCH_FAILED: null,

        PLACE_CREATE_REQUESTED: null,
        PLACE_CREATE_SUCCEEDED: null,

        PLACE_VISIT_REQUESTED: null,
        PLACE_VISIT_SUCCEEDED: null,
        PLACE_VISIT_FAILED: null,

        PLACE_LEAVE_CURRENT_PLACE: null,

        MESSAGE_COMPOSE_IN_PROCESS: null,
        MESSAGE_COMPOSE_COMPLETED: null,
        MESSAGE_COMPOSE_CANCELED: null,

        MESSAGE_CREATE_REQUESTED: null,
        MESSAGE_CREATE_SUCCEEDED: null,
        MESSAGE_CREATE_FAILED: null,

        PLACE_VISIT_MESSAGES_REQUESTED: null,
        PLACE_VISIT_MESSAGES_REQUESTED_SUCCEEDED: null,
        PLACE_VISIT_MESSAGES_REQUESTED_FAILED: null,

        REDUX_STORAGE_LOAD: null, // from redux-storage
    }),
    Paths: keyMirror({
        MESSAGE_COMPOSE: null,
        PLACE_VISIT: null,
        PLACE_CREATE: null,
        PLACE: null,
        PLACE_JOIN: null,
    })
};
