import { takeEvery, takeLatest } from 'redux-saga'

import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';
import { placesNearbyRequested } from '../actions/PlaceActionCreators'
import _ from 'underscore';

import * as placeSagas from './PlaceSagas'



export function* placeVisitSaga() {
    yield* takeEvery(ActionTypes.PLACE_VISIT_REQUESTED, (action)=> { placeSagas.visitPlace(action) });
}

export function* placesNearbySaga() {
    yield* takeEvery(ActionTypes.PLACES_NEARBY_REQUESTED, (action) => { placeSagas.fetchPlacesNearBy(action) });
}

export function* placeCreateSaga() {
    yield* takeEvery(ActionTypes.PLACE_CREATE_REQUESTED, (action) => { placeSagas.createPlace(action) });
}
