import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';
import { placesNearbyRequested } from '../actions/PlaceActionCreators'


function* fetchPlacesNearBy(action) {
    var api = new TotemApi(action.user);
    var location = action.location;
    try {
        // TODO freeze this!
        var places = yield call(()=>{ return api.placesNearby(location.lon, location.lat) });
        yield put({type: ActionTypes.PLACES_FETCH_SUCCEEDED, placesNearby: places});
    } catch (e) {
        yield put({type: ActionTypes.PLACES_FETCH_FAILED, message: e.message});
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}

function* createPlace(action){

    var api = new TotemApi(action.user);
    var { location, placeName, categoryId } = action;
    var { lon, lat } = location;

    try{
        var newPlace = yield call(()=>{ return api.placeCreate(placeName, categoryId, lon, lat) })
        yield put({type: ActionTypes.PLACE_CREATE_SUCCEEDED, newPlace: newPlace});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }

}


export function* placesNearbyRequestedSaga() {
    yield* takeEvery(ActionTypes.PLACES_NEARBY_REQUESTED, fetchPlacesNearBy);
}
export function* placeCreateRequestedSaga() {
    yield* takeEvery(ActionTypes.PLACE_CREATE_REQUESTED, createPlace);
}
