import { takeEvery, takeLatest } from 'redux-saga'

import TotemApi from '../util/TotemApi';
import _ from 'underscore';

import * as placeSagas from './PlaceSagas';
import * as messageSagas from './MessageSagas';
import { ActionTypes } from '../constants/TotemConstants';

export function* placeVisitSaga() {
    yield* takeEvery(ActionTypes.PLACE_VISIT_REQUESTED, placeSagas.visitPlace );
}

export function* placesNearbySaga() {
    yield* takeEvery(ActionTypes.PLACES_NEARBY_REQUESTED, placeSagas.fetchPlacesNearBy);
}

export function* fetchPlaceVisitMessagesSaga(){
    yield* takeEvery(ActionTypes.PLACE_VISIT_MESSAGES_REQUESTED, placeSagas.fetchPlaceVisitMessages);
}

export function* placeCreateSaga() {
    yield* takeEvery(ActionTypes.PLACE_CREATE_REQUESTED, placeSagas.createPlace);
}

export function* messageCreateSaga(){
    yield* takeEvery(ActionTypes.MESSAGE_COMPOSE_COMPLETED, messageSagas.createMessage);
}
