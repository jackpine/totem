import { ActionTypes } from '../constants/TotemConstants';

export const message = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.MESSAGE_COMPOSE_INITIATED:
        return Object.assign({},action.message)
    default:
        return state;
  }
};

module.exports = message;
