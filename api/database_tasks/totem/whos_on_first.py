import sys
import os
import datetime
import json
import codecs

from . import PLACE_CATEGORIES

from shapely.geometry import shape
from shapely.geometry import MultiPoint
from shapely.geometry import MultiPolygon
from shapely.geometry import Point

from geoalchemy2.shape import from_shape

def should_skip(path):
    return "-alt" in path

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

            joined_path = os.path.join(path, filename)
            if not should_skip(joined_path):
                with codecs.open(joined_path, "r", "utf-8") as fd:
                    geojson = json.loads(fd.read())
                    callback(geojson, joined_path)


def totem_data_from_wof(geojson):

    metadata = geojson['properties']

    if metadata['wof:id'] == 0:
        raise RuntimeError("Ignoring antipodal earth")

    category_id = PLACE_CATEGORIES[metadata['wof:placetype']]
    geometry_shape = shape(geojson['geometry'])
    if geometry_shape.__class__ == Point:
        boundary = MultiPolygon([geometry_shape.buffer(0.000001)])
    elif geometry_shape.__class__ == MultiPolygon:
        boundary = geometry_shape
    else:
        boundary = MultiPolygon([geometry_shape])

    bbox = MultiPoint([geojson['bbox'][0:2], geojson['bbox'][2:4]]).envelope
    name = geojson['properties']['wof:name']

    now = datetime.datetime.now()

    data = {"name": name,
            "category_id": category_id,
            "is_authoritative": True,
            "authoritative_boundary": from_shape(boundary, srid=4326),
            "boundary": from_shape(boundary, srid=4326),
            "import_source": "whosonfirst",
            "import_metadata": metadata,
            "created_at": now,
            "updated_at": now
    }
    for key in data.keys():
        if data[key] is None:
            raise RuntimeError("key is blank:{}".format(key ))

    return data
