import { call, put } from 'redux-saga/effects';
import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';

export function* fetchPlacesNearBy(action) {
    var location = action.location;
    try {
        var places = yield call(TotemApi.placesNearby, action.user, location.lon, location.lat);
        yield put({type: ActionTypes.PLACES_FETCH_SUCCEEDED, placesNearby: places});
    } catch (e) {
        yield put({type: ActionTypes.PLACES_FETCH_FAILED, message: e.message});
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}

export function* createPlace(action){
    var { location, placeName, categoryId } = action;
    var { lon, lat } = location;

    // WIP reduce this to a new list of nearby places
    try{
        var newPlace = yield call(TotemApi.placeCreate, action.user, placeName, categoryId, lon, lat);
        yield put({type: ActionTypes.PLACE_CREATE_SUCCEEDED, newPlace: newPlace});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }

}

export function* visitPlace(action){
    var { placeId, location, user} = action;
    var { lon, lat } = location;
    var api = new TotemApi(user);

    try{
        var fetchedVisit = yield call(TotemApi.visitCreate, action.user, placeId, lon, lat)
        yield put({type: ActionTypes.PLACE_VISIT_SUCCEEDED, visit: fetchedVisit});
        yield put({type: ActionTypes.MESSAGES_REQUESTED, place: fetchedVisit.place, user: user});
    } catch(e) {
        yield put({type: ActionTypes.PLACE_VISIT_FAILED, message: e});
        yield put({type: ActionTypes.ERROR, message: e});
    }
}


export default {
    fetchPlacesNearBy,
    createPlace,
    visitPlace,
}
