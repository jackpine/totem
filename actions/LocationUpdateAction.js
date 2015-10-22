var React = require('react-native');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var ActionTypes = TotemConstants.ActionTypes;
var LocationManager = React.NativeModules.TMLocationManager;

var {
  NativeAppEventEmitter
} = React;

var LocationUpdateAction = {
  createLocationUpdate: function(location, currentThreadID) {
    AppDispatcher.dispatch({
      type: ActionTypes.LOCATION_UPDATE,
      location: location,
    });
  }
};

NativeAppEventEmitter.addListener(LocationManager.locationUpdatesEventChannel,
                                  function(locationUpdate){
                                    LocationUpdateAction.createLocationUpdate(locationUpdate)
                                  });

module.exports = LocationUpdateAction;
