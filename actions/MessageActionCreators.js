import { ActionTypes } from '../constants/TotemConstants';

export function initiateMessageCompose(messageText, contentHeight){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_INITIATED,
        message: {text: messageText, contentHeight: contentHeight}
    }
}

export function messageComposeCompleted(messageText, contentHeight){
    return {
        type: ActionTypes.MESSAGE_COMPOSE_COMPLETED,
    }
}

