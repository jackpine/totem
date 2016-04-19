import { combineReducers } from 'redux';

import user from './user';
import location from './location';
import placesNearby from './places';

const totemApp = combineReducers({
    user,
    location,
    placesNearby
})

module.exports = totemApp;
