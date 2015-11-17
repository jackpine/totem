'use strict'

var React = require('react-native');
var NativeGlobals = React.NativeModules.TMGlobals;
var Geo = require('./Geo')
var urljoin = require('url-join');

var apiHost;
switch(NativeGlobals.buildType){
    case 'adhoc':
        apiHost = 'http://api-staging.totem-app.com';
        break;
    case 'appstore':
        apiHost = 'http://api.totem-app.com';
        break;
    default:
        apiHost = 'http://localhost:3000';
}

var DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

class TotemApi{

    static placesNearby(lon, lat){
        var params = `${lon},${lat}`;
        return fetch(urljoin(apiHost, '/api/v1/places/nearby', `?location=${encodeURIComponent(params)}`))
        .then((response) => response.json());
    }

    static placeCreate(name, category_id, lon, lat){

        var location = Geo.jsonFromPoint(lon, lat);
        var placeCreateOptions = {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body:JSON.stringify({
                location: location,
                place: {
                    name: name,
                    category_id: category_id,
            } }),
        };

        return fetch(urljoin(apiHost, '/api/v1/places'), placeCreateOptions)
        .then((response) => response.json());
    }
    static visitCreate(place_id, lon, lat){

        var location = Geo.jsonFromPoint(lon, lat);
        var visitCreateOptions = {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body:JSON.stringify({ visit: {place_id: place_id, location: location} }),
        };

        return fetch(urljoin(apiHost, '/api/v1/places', place_id, 'visits'), visitCreateOptions)
        .then((response) => response.json());
    }

}

module.exports = TotemApi;
