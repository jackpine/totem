'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var EventEmitter = require('EventEmitter');
var _ = require('underscore');
var React = require('react-native');

var {
    AsyncStorage,
} = React;

var ActionTypes = TotemConstants.ActionTypes;

var STORAGE_KEY = 'totem:user';

class UserProfileStore extends EventEmitter{

    constructor(){
        super();
        var self = this;
        this.dispatchToken = AppDispatcher.register((action)=>this.processDispatch(action));
    }
    async processDispatch(action){
        switch(action.type) {
            case ActionTypes.USER_SAVE:
                // save the profile
                await this.save(action.user);
                this.emit('change');
                break;
            default:
                // do nothing
        }
    }
    async get(){
        try{
            var user = await AsyncStorage.getItem(STORAGE_KEY);
            if(user)
                user = JSON.parse(user);
            return user;
        }
        catch(e){
            //TODO set up remote logging here
            console.log(`Caught massive error ${e} trying to load the user profile`);
            throw(e);
        }
    }

    async save(user){
        try{
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        }
        catch(e) {
            //TODO set up remote logging here
            console.log(`Caught error ${e} trying to save the user profile`);
            throw(e);
        }
    }

}

module.exports = new UserProfileStore();
