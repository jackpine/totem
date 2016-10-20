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
        location,
        user
    }
}

export function placeVisitRequested(placeId, location, user){
    return {
        type: ActionTypes.PLACE_VISIT_REQUESTED,
        placeId,
        user,
        location,
    }
}

export function placeLeaveCurrentPlace(){
    return {
        type: ActionTypes.PLACE_LEAVE_CURRENT_PLACE,
    }
}
