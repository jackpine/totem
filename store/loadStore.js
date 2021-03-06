import { createStore, applyMiddleware, compose  } from 'redux'
import createLogger from 'redux-logger'
import reducers from '../reducers/index';
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-reactnativeasyncstorage';
import filter from 'redux-storage-decorator-filter'
import reducer from '../reducers';
import { ActionTypes } from '../constants/TotemConstants';

import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas';

export default function loadStore() {

    const engine = filter(createEngine('totem-app-state-tree'), [], [
        'blacklisted-key',
        ['reduxStoreLoaded']
    ]);

    const engineMiddleware = storage.createMiddleware(engine);
    const sagaMiddleware = createSagaMiddleware()

    const loggerPredicate = (getState, action)=>{
        if(action.type == "REDUX_STORAGE_SAVE"){
            return false;
        }
        return true;
    }
    const createStoreWithMiddleware = applyMiddleware(engineMiddleware, createLogger({predicate: loggerPredicate }), sagaMiddleware)(createStore);

    const storageReducer = storage.reducer(reducer);

    const store = createStoreWithMiddleware(storageReducer);

    const load = storage.createLoader(engine);

    sagaMiddleware.run(rootSaga).done.catch((error) => console.warn(error));;

    load(store).then((newState) => {
        console.log('Loaded state:', newState);
        store.dispatch({type: ActionTypes.REDUX_STORAGE_LOADED});
    }).catch(() => console.log('Failed to load previous state'));


    return store;

}
