import { takeEvery } from 'redux-saga/effects'

import TotemApi from '../util/TotemApi';
import _ from 'underscore';

import * as placeSagas from './PlaceSagas';
import * as messageSagas from './MessageSagas';
import { ActionTypes } from '../constants/TotemConstants';

export default function* rootSaga(){

    yield takeEvery(ActionTypes.REDUX_STORAGE_LOADED, placeSagas.leavePlace);

    yield takeEvery(ActionTypes.PLACE_VISIT_REQUESTED, placeSagas.visitPlace );
    yield takeEvery(ActionTypes.PLACES_NEARBY_REQUESTED, placeSagas.fetchPlacesNearBy);
    yield takeEvery(ActionTypes.PLACE_VISIT_MESSAGES_REQUESTED, placeSagas.fetchPlaceVisitMessages);
    yield takeEvery(ActionTypes.PLACE_CREATE_REQUESTED, placeSagas.createPlace);

    yield takeEvery(ActionTypes.MESSAGE_COMPOSE_COMPLETED, messageSagas.createMessage);

}
