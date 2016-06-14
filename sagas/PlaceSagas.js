import { call, put } from 'redux-saga/effects';
import TotemApi from '../util/TotemApi';

function* fetchPlacesNearBy(action) {
    var location = action.location;
    var api = new TotemApi(action.user);
    try {
        // TODO freeze this!
        var places = yield call(api.placesNearby, location.lon, location.lat);
        yield put({type: ActionTypes.PLACES_FETCH_SUCCEEDED, placesNearby: places});
    } catch (e) {
        yield put({type: ActionTypes.PLACES_FETCH_FAILED, message: e.message});
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}

function* createPlace(action){
    var { location, placeName, categoryId } = action;
    var { lon, lat } = location;
    var api = new TotemApi(action.user);

    // WIP reduce this to a new list of nearby places
    try{
        var newPlace = yield call(api.placeCreate, placeName, categoryId, lon, lat);
        yield put({type: ActionTypes.PLACE_CREATE_SUCCEEDED, newPlace: newPlace});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }

}

function* visitPlace(action){
    var { placeId, location} = action;
    var { lon, lat } = location;
    var api = new TotemApi(action.user);

    try{
        var visit = yield call(()=>{ return api.visitCreate(placeId, lon, lat) })
        // TODO reduce this to state, and "put" the user in their new place
        yield put({type: ActionTypes.PLACE_VISIT_SUCCEEDED, visit: visit});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }
}


module.exports = {
    fetchPlacesNearBy,
    createPlace,
    visitPlace,
}
