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

var UserSaveAction = {
  saveProfile: function(username, email, publicToken, privateToken) {

      var user = new User(username, email, publicToken, PrivateToken);

      AppDispatcher.dispatch({
          type: ActionTypes.USER_PROFILE_SAVE,
          user: user
      });
  }
};
