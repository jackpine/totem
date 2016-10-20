import { ActionTypes } from '../constants/TotemConstants';

export function messageComposeInitiated(subjectText, bodyText,  contentHeight){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_INITIATED,
        message: {body: bodyText, subject: subjectText, contentHeight: contentHeight}
    }
}

export function messageComposeCompleted(){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_COMPLETED,
    }
}

export function messageComposeCanceled(){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_CANCELED,
    }
}

