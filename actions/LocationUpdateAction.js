var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var ActionTypes = TotemConstants.ActionTypes;

module.exports = {
    createLocationUpdate: function(location, currentThreadID) {
        AppDispatcher.dispatch({
            type: ActionTypes.LOCATION_UPDATE,
            location: location,
        });
    }
};
