import sys
import os
import json
import datetime
from subprocess import call

import IPython
from shapely.geometry import shape
from shapely.geometry import MultiPoint
from shapely.geometry import MultiPolygon

from geoalchemy2.shape import from_shape

from totem_database import get_places_table

# PLACE_CATEGORIES =   {
    # 'continent': 1,
    # 'country': 2,
    # 'region': 3,
    # 'county': 4,
    # 'locality': 5,
    # 'neighbourhood': 6,
    # 'neighborhood': 6,
# }
PLACE_CATEGORIES = {
        u'disputed':   "",
        u'county':     4,
        u'marinearea': 3,
        u'localadmin': 5,
        u'locality':   5,
        u'campus':     6,
        u'country':    2,
        u'region':     3,
        u'macrohood':  6,
        u'microhood':  6,
        u'planet':     1,
        u'dependency': 4,
        u'macroregion': 3,
        u'macrocounty': 2,
        u'timezone':    1,
        u'empire':      2,
        u'ocean':       1,
        u'continent':   1,
        u'neighbourhood': 6,
}


def walk_dir(path_to_search, callback):


    iter = os.walk(path_to_search);

    count = 0
    while True:

        try:
            dir_files = iter.next()
        except:
            print 'reached the end!'
            return 0;

        path = dir_files[0];
        p = path.lstrip('./')
        for filename in  dir_files[2]:
            if count % 1000 == 0:
                sys.stdout.write('.')
                sys.stdout.flush()
            count += 1
            callback(os.path.join('/', p, filename))


def main(argv):

    places = get_places_table()
    place_types = {}

    def insert_record(path):
        if "-alt" not in path:
            with open(path) as fd:
                json_string = fd.read()
                geojson = json.loads(json_string)
                metadata = geojson['properties']
                try:

                    if metadata['wof:placetype'] == "disputed":
                        # dont bother
                        return

                    category_id = PLACE_CATEGORIES[metadata['wof:placetype']]
                    boundary = MultiPolygon([shape(geojson['geometry'])])
                    bbox = MultiPoint([geojson['bbox'][0:2], geojson['bbox'][2:4]]).envelope
                    name = geojson['properties']['wof:name']

                    now = datetime.datetime.now()

                    places.insert({"name": name,
                      "category_id": category_id,
                      "is_authoritative": True,
                      "authoritative_boundary": from_shape(boundary, srid=4326),
                      "boundary": from_shape(boundary, srid=4326),
                      "import_source": "whosonfirst",
                      "import_metadata": json.dumps(metadata),
                      "created_at": now,
                      "updated_at": now
                    }).execute()
                except Exception, e:
                    print "Skipping:", metadata['wof:id']
                    print e

    walk_dir(argv[0], insert_record)


    # for path in argv:
        # data = json.loads(open(path).read())
        # for feature in data['features']:
            # place_shape = shape(feature['geometry'])
            # metadata, name = derive_metadata_from_feature(feature)
            # now = datetime.datetime.now()
            # places.insert({"name": name,
             # "category_id": PLACE_CATEGORIES[metadata["place_type"]],
             # "is_authoritative": True,
             # "authoritative_boundary": from_shape(place_shape, srid=4326),
             # # for now just copy the other boundary
             # "boundary": from_shape(place_shape, srid=4326),
             # "import_source": "flickr-shapefiles-2.0.1",
             # "import_metadata": metadata,
             # "created_at": now,
             # "updated_at": now
             # }).execute()

        # print(path)
        # print(len(data["features"]))

if __name__ == '__main__':
    main(sys.argv[1:])
