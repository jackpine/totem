'use strict'

var React = require('react-native');
var NativeGlobals =   React.NativeModules.TMGlobals;
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

class TotemApi{

    static placesNearby(lon, lat){
        var params = `${lon},${lat}`;
        return fetch(urljoin(apiHost, '/api/v1/places/nearby', `?location=${encodeURIComponent(params)}`))
        .then((response) => response.json());
    }

    static placeCreate(placeParams){

        var placeCreateOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({ place: placeParams }),
        };

        return fetch(urljoin(apiHost, '/api/v1/places'), placeCreateOptions)
        .then((response) => response.json());
    }
    static visitCreate(visitParams){

        var visitCreateOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({ visit: visitParams }),
        };

        return fetch(urljoin(apiHost, '/api/v1/places', visitParams.place_id, 'visits'), visitCreateOptions)
        .then((response) => response.json());
    }

}

module.exports = TotemApi;
