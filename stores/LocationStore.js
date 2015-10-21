'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var Backbone = require('backbone');
var _ = require('underscore');

var ActionTypes = TotemConstants.ActionTypes;

var currentLocation = null;

var LocationStore = _.extend({}, Backbone.Events, {

    getLatest: function(){
        return currentLocation;
    }

})

LocationStore.dispatchToken = AppDispatcher.register(function(action) {
    switch(action.type) {

        case ActionTypes.LOCATION_UPDATE:
            currentLocation = action.location
            LocationStore.trigger('change:currentLocation')
            break;

        default:
            // do nothing
    }

});

module.exports = LocationStore;
