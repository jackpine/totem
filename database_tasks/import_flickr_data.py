import sys
import os
import json
import datetime

import IPython
from shapely.geometry import shape
from geoalchemy2.shape import from_shape

from totem_database import get_places_table

PLACE_CATEGORIES =   {
    'continent': 1,
    'country': 2,
    'region': 3,
    'county': 4,
    'locality': 5,
    'neighbourhood': 6,
    'neighborhood': 6,
}

def derive_metadata_from_feature(feature):

    metadata = feature["properties"]
    metadata["flickr_id"] =    feature["id"];
    metadata["geometry"] = {}
    metadata["geometry"]["created"] =      feature["geometry"]["created"]
    metadata["geometry"]["alpha"] =        feature["geometry"]["alpha"]
    metadata["geometry"]["points"] =       feature["geometry"]["points"]
    metadata["geometry"]["edges"] =        feature["geometry"]["edges"]
    metadata["geometry"]["is_donuthole"] = feature["geometry"]["is_donuthole"]
    metadata["geometry"]["bbox"] =         feature["geometry"]["bbox"]
    name = feature["properties"]["label"].split(',')[0];
    return metadata, name

def main(argv):

    places = get_places_table()

    for path in argv:
        data = json.loads(open(path).read())
        for feature in data['features']:
            place_shape = shape(feature['geometry'])
            metadata, name = derive_metadata_from_feature(feature)
            now = datetime.datetime.now()
            places.insert({"name": name,
             "category_id": PLACE_CATEGORIES[metadata["place_type"]],
             "is_authoritative": True,
             "authoritative_boundary": from_shape(place_shape, srid=4326),
             # for now just copy the other boundary
             "boundary": from_shape(place_shape, srid=4326),
             "import_source": "flickr-shapefiles-2.0.1",
             "import_metadata": metadata,
             "created_at": now,
             "updated_at": now
             }).execute()

        print(path)
        print(len(data["features"]))

if __name__ == '__main__':
    main(sys.argv[1:])
