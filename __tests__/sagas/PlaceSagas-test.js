//import * as placeSagas from '../../sagas/PlaceSagas';
import placeSagas from '../../sagas/PlaceSagas';
import * as placeActionCreators from '../../actions/PlaceActionCreators';
import { call, put } from 'redux-saga/effects';
import TotemApi from '../../util/TotemApi';

import { expect } from 'chai';

describe('fetchPlacesNearby', () => {
    it('should invoke the Totem Api with a user and lat lon', ()=>{
        const generator = placeSagas.fetchPlacesNearBy(placeActionCreators.placesNearbyRequested({lon: 0, lat: 0}, {user_id: 0}))
        expect(generator.next().value).deep.equal(call(TotemApi.placesNearby, {user_id: 0}, 0, 0))
    })
});

