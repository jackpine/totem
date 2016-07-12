import { ActionTypes } from '../constants/TotemConstants';

// locations are a list of the last N locations
export function locationUpdate(locationUpdate){

    let location;
    if(locationUpdate && locationUpdate.length > 0){
        location = locationUpdate[0];
    }
    else{
        location = null
    }
    return {
        type: ActionTypes.LOCATION_UPDATED,
        location: location
    }
}
