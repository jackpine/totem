import { combineReducers } from 'redux';

import user from './user';
import location from './location';
import reduxStoreLoaded from './redux';
import { placesNearby, placeVisit } from './places';
import message from './messages'

const totemApp = combineReducers({
    user,
    location,
    placesNearby,
    reduxStoreLoaded,
    currentVisit: placeVisit,
    message: message,
})

module.exports = totemApp;
