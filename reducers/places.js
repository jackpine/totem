import { ActionTypes } from '../constants/TotemConstants';

export const placesNearby = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACES_FETCH_SUCCEEDED:
        return action.placesNearby.concat([])
    default:
        return state;
  }
};

export const placeVisit = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACE_VISIT_SUCCEEDED:
        return Object.assign({}, action.visit);
    // XXX FIXME, this should return a visit
    case ActionTypes.PLACE_CREATE_SUCCEEDED:
        return Object.assign({}, action.newPlace);
    case ActionTypes.PLACE_LEAVE_CURRENT_PLACE:
        return null;
    default:
        return state;
  }
}
