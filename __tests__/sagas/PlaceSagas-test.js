//import * as placeSagas from '../../sagas/PlaceSagas';
import placeSagas from '../../sagas/PlaceSagas';
import * as placeActionCreators from '../../actions/PlaceActionCreators';
import { call, put } from 'redux-saga/effects';
import TotemApi from '../../util/TotemApi';
import { ActionTypes } from '../../constants/TotemConstants';

import { expect } from 'chai';

describe('fetchPlacesNearby', () => {
    it('should invoke the Totem Api with a user and lat lon', ()=>{
        const generator = placeSagas.fetchPlacesNearBy(placeActionCreators.placesNearbyRequested({lon: 0, lat: 0}, {user_id: 0}))
        expect(generator.next().value).deep.equal(call(TotemApi.placesNearby, {user_id: 0}, 0, 0))

        expect(generator.next([{some: 'place'}]).value).deep.equal(put({type: ActionTypes.PLACES_FETCH_SUCCEEDED, placesNearby: [{some: 'place'}]}));

        expect(generator.next().done).to.be.true;
    });

    it('should handle errors in the fetch by dispatching some error actions', ()=>{

        const generator = placeSagas.fetchPlacesNearBy(placeActionCreators.placesNearbyRequested({lon: 0, lat: 0}, {user_id: 0}))
        expect(generator.next().value).deep.equal(call(TotemApi.placesNearby, {user_id: 0}, 0, 0))

        expect(generator.throw({message: 'error~'}).value).deep.equal(put({type: ActionTypes.PLACES_FETCH_FAILED, message: 'error~'}));
        expect(generator.next().value).deep.equal(put({type: ActionTypes.ERROR, message: 'error~'}))

    });

});

describe('visitPlace', () => {
    it('should invoke the Totem Api with a user, place_id and lat lon', ()=>{

        const generator = placeSagas.visitPlace(placeActionCreators.placeVisitRequested(1, {lon: 2, lat: 3}, {user_id: 4}))
        expect(generator.next().value).deep.equal(call(TotemApi.visitCreate, {user_id: 4}, 1, 2, 3))

        expect(generator.next({some: 'visit', place: {place_id: 1}}).value).deep.equal(put({type: ActionTypes.PLACE_VISIT_SUCCEEDED, visit: {some: 'visit', place: {place_id: 1}}}));

        expect(generator.next().value).deep.equal(put({type: ActionTypes.MESSAGES_REQUESTED, place: {place_id: 1}, user: {user_id: 4}}));
        expect(generator.next().done).to.be.true;
    });

    it('should handle errors in the fetch by dispatching some error actions', ()=>{

        const generator = placeSagas.visitPlace(placeActionCreators.placeVisitRequested(1, {lon: 2, lat: 3}, {user_id: 4}))
        expect(generator.next().value).deep.equal(call(TotemApi.visitCreate, {user_id: 4}, 1, 2, 3))

        expect(generator.throw('error~').value).deep.equal(put({type: ActionTypes.PLACE_VISIT_FAILED, message: 'error~'}));
        expect(generator.next().value).deep.equal(put({type: ActionTypes.ERROR, message: 'error~'}))

    });

});

