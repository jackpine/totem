import { call, put } from 'redux-saga/effects';
import TotemApi from '../util/TotemApi';
import { ActionTypes } from '../constants/TotemConstants';
import { messageCreateRequested, messageCreateSucceeded } from '../actions/MessageActionCreators';

export function* createMessage(action){
    var { place, visit, user, subject, body, location } = action.message

    yield put(messageCreateRequested(subject, body, user, visit, place, location))

    try{
        var newMessage = yield call(TotemApi.messageCreate, user, subject, body, place.id, visit.id, location.lon, location.lat)
        yield put(messageCreateSucceeded(newMessage.subject,
                                         newMessage.body,
                                         newMessage.user,
                                         newMessage.visit,
                                         newMessage.place,
                                         newMessage.location))
    }
    catch(e){
        yield put({type: ActionTypes.ERROR, message: e.message});
    }


}

export default {
    createMessage,
}
