var urljoin = require('url-join');

var apiHost = 'http://localhost:3000';

class TotemApi{

    static placesNearby(lon, lat){
        var params = `${lon},${lat}`;
        return fetch(urljoin(apiHost, "/api/v1/places/nearby", `?location=${encodeURIComponent(params)}`))
        .then((response) => response.json())
    }

}

module.exports = TotemApi;
