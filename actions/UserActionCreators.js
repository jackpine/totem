import { ActionTypes } from '../constants/TotemConstants';

export function userSignOut(locationUpdate){
    return {
        type: ActionTypes.USER_DELETE,
        user: null
    }
}


