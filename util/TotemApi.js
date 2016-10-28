'use strict'
var Geo = require('./Geo')
var urljoin = require('url-join');
var jsrassign = require('jsrsasign');


var DEFAULT_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

class TotemApi{

    static async placesNearby(user, lon, lat){
        var params =  {lon: lon, lat: lat};
        var encodedParams = TotemApi._encodeJWT(user, params);
        var response = await fetch(urljoin(TotemApi.apiHost(), '/api/v1/places/nearby.json', `?jwt=${encodedParams}`));
        return response.json();
    }

    static async placeCreate(user, name, category_id, lon, lat){

        var placeCreateParams = {
            location: Geo.jsonFromPoint(lon, lat),
            place: {
              name: name,
              category_id: category_id}
        };

        var jwtToken = TotemApi._encodeJWT(user, placeCreateParams);

        var response = await TotemApi._post('/api/v1/places.json', jwtToken);
        return response.json();
    }

    static async messageCreate(user, subject, body, place_id, visit_id, lon, lat){
        var messageCreateParams = {
            message:{
                location: Geo.jsonFromPoint(lon, lat),
                subject: subject,
                body: body,
                place_id: place_id,
                visit_id: visit_id,
            }
        };

        var jwtToken = TotemApi._encodeJWT(user, messageCreateParams);

        var response = await TotemApi._post(`/api/v1/places/${place_id}/messages.json`, jwtToken);
        return response.json();
    }

    static async visitCreate(user, place_id, lon, lat){

        var visitCreateParams = { visit: {place_id: place_id, location: Geo.jsonFromPoint(lon, lat)} };
        var jwtToken = TotemApi._encodeJWT(user, visitCreateParams);

        var response = await TotemApi._post(urljoin('/api/v1/places', place_id, 'visits'), jwtToken);
        return response.json();
    }

    static userSessionUrl(){
        return urljoin(TotemApi.apiHost(), '/users/sign_up')
    }

    static apiHost(){
        var ReactNative = require('react-native');
        var NativeGlobals = ReactNative.NativeModules.TMGlobals;
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
        return apiHost;

    }

    static _encodeJWT(user, params){

        params['public_token'] =  user.public_token;

        var header = JSON.stringify({alg: 'HS256', typ: 'JWT'});
        var payload = JSON.stringify(params);

        return jsrassign.jws.JWS.sign('HS256', header, payload, user.private_token);
    }

    static async _post(url, jwtToken){
        var fetchOptions = {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({jwt: jwtToken})
        };
        return fetch(urljoin(TotemApi.apiHost(), url), fetchOptions);
    }


}

module.exports = TotemApi;
