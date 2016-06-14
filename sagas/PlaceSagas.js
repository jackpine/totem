import { call, put } from 'redux-saga/effects';
import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';

export function* fetchPlacesNearBy(action) {
    console.log('inside fetch places nearby')
    var location = action.location;
    var api = new TotemApi(action.user);
    try {
        var places = yield call(()=>api.placesNearby(location.lon, location.lat));
        yield put({type: ActionTypes.PLACES_FETCH_SUCCEEDED, placesNearby: places});
    } catch (e) {
        yield put({type: ActionTypes.PLACES_FETCH_FAILED, message: e.message});
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}

export function* createPlace(action){
    var { location, placeName, categoryId } = action;
    var { lon, lat } = location;
    var api = new TotemApi(action.user);

    // WIP reduce this to a new list of nearby places
    try{
        var newPlace = yield call(()=>api.placeCreate(placeName, categoryId, lon, lat));
        yield put({type: ActionTypes.PLACE_CREATE_SUCCEEDED, newPlace: newPlace});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }

}

export function* visitPlace(action){
    console.log('inside visit place')
    var { placeId, location} = action;
    var { lon, lat } = location;
    var api = new TotemApi(action.user);

    try{
        var fetchedVisit = yield call(()=>api.visitCreate(placeId, lon, lat))
        // TODO reduce this to state, and "put" the user in their new place
        yield put({type: ActionTypes.PLACE_VISIT_SUCCEEDED, visit: fetchedVisit.place});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}


export default {
    fetchPlacesNearBy,
    createPlace,
    visitPlace,
}
