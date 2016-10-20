import { call, put } from 'redux-saga/effects';
import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';

export function* createMessage(action){
    var { currentVisit, message, user } = action

    // WIP reduce this to a new list of nearby places
    try{
        var newPlace = yield call(TotemApi.placeMessage, user, message, currentVisit);
        yield put({type: ActionTypes.MESSAGE_CREATE_SUCCEEDED, newPlace: newPlace});
    } catch(e) {
        yield put({type: ActionTypes.ERROR, message: e.message});
    }

}

export default {
    createMessage,
}
