'use strict';

var keyMirror = require('keymirror');

module.exports = {
    ActionTypes: keyMirror({
        LOCATION_UPDATE: null,
        USER_SAVE: null,
        USER_DELETE: null,
    })
};
