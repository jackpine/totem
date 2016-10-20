import { ActionTypes } from '../constants/TotemConstants';

export const message = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.MESSAGE_COMPOSE_INITIATED:
        return Object.assign({}, action.message)
    case ActionTypes.MESSAGE_COMPOSE_CANCELED:
        return null;
    default:
        return state;
  }
};

module.exports = message;
