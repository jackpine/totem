import { ActionTypes } from '../constants/TotemConstants';

export const reduxStoreLoaded = (state = null, action) => {
    switch(action.type) {
        case ActionTypes.REDUX_STORAGE_LOAD:
            return true
        default:
            return state;
    }
};

module.exports = reduxStoreLoaded
