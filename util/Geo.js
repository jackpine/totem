'use strict'

class Geo{

    static jsonFromPoint(lon, lat){
        if(!(lon && lat))
            throw 'missing arguments to jsonFromPoint'
        return { 'type': 'Point', 'coordinates': [lon,
                                                  lat] };
    }
}

module.exports = Geo;
