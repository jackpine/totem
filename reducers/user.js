import { ActionTypes } from '../constants/TotemConstants';

const user = (state = null, action) => {
  switch(action.type) {
    case ActionTypes.USER_SAVE:
        return action.user
    case ActionTypes.USER_DELETE:
        return null
    default:
        return state;
  }
}

module.exports = user;
