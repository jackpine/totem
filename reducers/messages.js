import { ActionTypes } from '../constants/TotemConstants';

export const message = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.MESSAGE_COMPOSE_IN_PROCESS:
        return Object.assign({}, action.message)
    case ActionTypes.MESSAGE_COMPOSE_CANCELED:
        return null;
    case ActionTypes.MESSAGE_CREATE_REQUESTED:
        return Object.assign({}, action.message)
    case ActionTypes.MESSAGE_CREATE_SUCCEEDED:
        return Object.assign({}, action.message)
    default:
        return state;
  }
};

module.exports = message;
