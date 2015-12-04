'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var EventEmitter = require('EventEmitter');
var _ = require('underscore');

var ActionTypes = TotemConstants.ActionTypes;

// this is the stand-in store
var currentLocation = null;

class LocationStore extends EventEmitter{

    constructor(){

        super();
        var self = this;

        this.dispatchToken = AppDispatcher.register((action)=>this.processDispatch(action));
    }

    processDispatch(action){
        switch(action.type) {

            case ActionTypes.LOCATION_UPDATE:
                if(action.location == null)
                    currentLocation = null;
                else{
                    currentLocation = action.location[0]
                }
                this.emit('change')
                break;

            default:
                // do nothing
        }

    }

    getLatestAsync(){
        return new Promise(function(resolve, reject){
            resolve(currentLocation);
        });
    }
}

module.exports = new LocationStore;
