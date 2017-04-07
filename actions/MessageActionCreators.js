import { ActionTypes } from '../constants/TotemConstants';

export function messageComposeInProcess(subject, body,  contentHeight, errors){

    return {
        type: ActionTypes.MESSAGE_COMPOSE_IN_PROCESS,
        message: {body: body, subject: subject, contentHeight: contentHeight, errors: errors}
    }
}

export function messageComposeCompleted(subject, body, user, visit, location){
    return { 
        type: ActionTypes.MESSAGE_COMPOSE_COMPLETED,
        message: {
            subject: subject,
            body: body,
            user: user,
            visit: visit,
            place: visit.place,
            location: location
        }
    }
}

export function messageCreateRequested(subject, body, user, visit, place, location){
    return {
        type: ActionTypes.MESSAGE_CREATE_REQUESTED,
        message: {
            messageCreateState: ActionTypes.MESSAGE_CREATE_REQUESTED,
            subject: subject,
            body: body,
            user: user,
            visit: visit,
            place: place,
            location: location
        }
    }
}

export function messageCreateSucceeded(subject, body, user, visit, place, location){
    return {
        type: ActionTypes.MESSAGE_CREATE_SUCCEEDED,
        message: {
            messageCreateState: ActionTypes.MESSAGE_CREATE_SUCCEEDED,
            subject: subject,
            body: body,
            user: user,
            visit: visit,
            place: place,
            location: location
        }
    }
}

export function messageComposeCanceled(){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_CANCELED,
    }
}

