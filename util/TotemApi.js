'use strict'

var React = require('react-native');
var NativeGlobals = React.NativeModules.TMGlobals;
var Geo = require('./Geo')
var urljoin = require('url-join');
var jsrassign = require('jsrsasign');

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

    constructor(user){
        this.user = user;
    }

    async placesNearby(lon, lat){
        var params =  {lon: lon, lat: lat};
        var encodedParams = this._encodeJWT(params);
        var response = await fetch(urljoin(apiHost, '/api/v1/places/nearby.json', `?jwt=${encodedParams}`));
        return response.json();
    }

    async placeCreate(name, category_id, lon, lat){

        var placeCreateParams = {
            location: Geo.jsonFromPoint(lon, lat),
            place: {
              name: name,
              category_id: category_id}
        };

        var response = await this._post('/api/v1/places.json', placeCreateParams);
        return response.json();
    }
    async visitCreate(place_id, lon, lat){

        var visitCreateParams = { visit: {place_id: place_id, location: Geo.jsonFromPoint(lon, lat)} };

        var response = await this._post(urljoin('/api/v1/places', place_id, 'visits'), visitCreateParams);
        return response.json();
    }

    static userSessionUrl(){
        return urljoin(apiHost, '/users/sign_up')
    }

    _encodeJWT(params){

        params['public_token'] =  this.user.public_token;

        var header = JSON.stringify({alg: 'HS256', typ: 'JWT'});
        var payload = JSON.stringify(params);

        return jsrassign.jws.JWS.sign('HS256', header, payload, this.user.private_token);
    }

    async _post(url, params){
        var jwtToken = this._encodeJWT(params);

        var fetchOptions = {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({jwt: jwtToken})
        };
        return fetch(urljoin(apiHost, url), fetchOptions);
    }


}

module.exports = TotemApi;
