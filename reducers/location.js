import { ActionTypes } from '../constants/TotemConstants';

export default location = (state = null, action) => {
    switch(action.type) {
        case ActionTypes.LOCATION_UPDATED:
            if(action.location == null)
                return null;
            else{
                return action.location;
            }
            break;
        default:
            return state
    }
}

