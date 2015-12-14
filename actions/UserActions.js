'use strict'

var React = require('react-native');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var User = require('../models/User');
var ActionTypes = TotemConstants.ActionTypes;
var LocationManager = React.NativeModules.TMLocationManager;

var {
  NativeAppEventEmitter
} = React;

var UserActions  = {
    save(user){
      AppDispatcher.dispatch({
          type: ActionTypes.USER_SAVE,
          user: user
      });
    }
}

module.exports = UserActions;
