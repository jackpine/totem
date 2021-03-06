import { ActionTypes } from '../constants/TotemConstants';

export const placesNearby = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACES_FETCH_SUCCEEDED:
        return action.placesNearby.concat([])
    default:
        return state;
  }
};

export const places = (state = null, action) => {

  switch(action.type) {
    case ActionTypes.PLACE_CREATE_SUCCEEDED:
        return state;
    default:
        return state;
  }
}

export const placeVisit = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACE_VISIT_SUCCEEDED:
        return Object.assign({}, action.visit);
    case ActionTypes.PLACE_LEAVE_CURRENT_PLACE:
        return null;
    default:
        return state;
  }
}

export const placeVisitMessages = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.PLACE_VISIT_MESSAGES_REQUESTED_SUCCEEDED:
        return action.messages.slice();
    case ActionTypes.PLACE_LEAVE_CURRENT_PLACE:
        return null;
    default:
        return state;
  }
}
