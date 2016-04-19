import { ActionTypes } from '../constants/TotemConstants';

const places = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACES_FETCH_SUCCEEDED:
        return action.placesNearby.concat([])
    default:
        return state;
  }
}

module.exports = places;

