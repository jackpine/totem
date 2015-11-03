var urljoin = require('url-join');

var apiHost = 'http://localhost:3000';

class TotemApi{

    static placesNearby(lon, lat){
        var params = `${lon},${lat}`;
        return fetch(urljoin(apiHost, "/api/v1/places/nearby", `?location=${encodeURIComponent(params)}`))
        .then((response) => response.json())
    }

    static placeCreate(placeParams){

        var placeCreateOptions = {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify(placeParams),
        };

        return fetch(urljoin(apiHost, "/api/v1/places"), placeCreateOptions)
        .then((response) => response.json());
    }

}

module.exports = TotemApi;
