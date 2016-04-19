import { ActionTypes } from '../constants/TotemConstants';

export function placesNearbyRequested(location, user){
    return {
        type: ActionTypes.PLACES_NEARBY_REQUESTED,
        user: user,
        location: location
    }
}

export function placeCreateRequested(placeName, categoryId, location, user){
    return {
        type: ActionTypes.PLACE_CREATE_REQUESTED,
        placeName,
        categoryId,
        user,
        location,
        user
    }

}
