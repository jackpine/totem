'use strict';

jest.dontMock('../LocationStore');

describe('location store', ()=>{

    var TotemConstants = require.requireActual('../../constants/TotemConstants');

    var AppDispatcher;
    var LocationStore;
    var callback;

    beforeEach(function() {
        AppDispatcher = require('../../dispatcher/AppDispatcher');
        LocationStore = require('../LocationStore');
        callback = AppDispatcher.register.mock.calls[0][0];
    });

    it('registers a callback with the dispatcher', function() {
        expect(AppDispatcher.register.mock.calls.length).toBe(1);
    });

    it('returns null when no location set', () => {
        console.log(TotemConstants)
        expect(LocationStore.getLatest()).toBe(null);
    });

    it('it returns the latest location', () => {

        var location = [{'verticalAccuracy':-1,
            'floor':0,
            'horizontalAccuracy':5,
            'lon':-122.0,
            'lat':37.0,
            'timestamp':'2015-10-22T13:34:47-05:00',
            'altitude':0}
        ];
        var payload = {
            type: TotemConstants.ActionTypes.LOCATION_UPDATE,
            location: location
        };
        callback(payload)

        expect(LocationStore.getLatest()).toBeTruthy();
        expect(LocationStore.getLatest()[0]['lon']).toBe(-122.0);
        expect(LocationStore.getLatest()[0]['lat']).toBe(37.0);
        expect(LocationStore.getLatest()[0]['timestamp']).toBe('2015-10-22T13:34:47-05:00');

    });


})
