import sys, os
from subprocess import call

import IPython

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql.expression import cast
from sqlalchemy import Column, Integer, Sequence, types, Float, Index, UniqueConstraint

from totem import PLACE_CATEGORIES
from totem.whos_on_first import totem_data_from_wof
from totem.whos_on_first import should_skip
from totem.whos_on_first import walk_dir

# get places table
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, Table, MetaData, Column
from sqlalchemy.dialects.postgresql import JSONB
from geoalchemy2 import Geometry

def get_db_engine():
    host = os.environ['DB_HOST']
    port = os.environ['DB_PORT']
    username = os.environ['DB_USERNAME']
    database = os.environ['DB_NAME']
    return create_engine(sqlalchemy.engine.url.URL('postgresql', username=username, port=port, database=database, host=host))

def get_places_table():

    engine = get_db_engine()
    meta = MetaData()
    meta.bind = engine
    meta.reflect()
    places = Table('places',
            meta,
            Column('authoritative_boundary', Geometry('MULTIPOLYGON')),
            Column('import_metadata', JSONB),
     #       Index("index_wof_id_on_places", cast(meta.tables['places'].c.import_metadata["wof:id"].astext, Integer)),
            autoload=True,
            autoload_with=engine,
            extend_existing=True);

    return places, engine

places, engine = get_places_table()
session = sessionmaker(bind=engine)()

def upsert_record(wof_json, path):
    assert wof_json["properties"]["wof:id"] >= 0
    try:
        data = totem_data_from_wof(wof_json)
        if len(data['import_metadata']['wof:superseded_by']) > 0:
            raise RuntimeError('Superceded')
        stmt = insert(places).values(data).on_conflict_do_update(index_elements=[cast(places.c.import_metadata["wof:id"].astext, Integer)], set_=data)
        stmt.execute()
    except Exception, e:
        if "wof:name" in wof_json["properties"] and wof_json["properties"]["wof:name"]:
            name = wof_json["properties"]["wof:name"].encode('utf-8')
        else:
            name = ''
        print "  Skipping: {0}:{1}:{2}".format(path, name, e)


def main(argv):

    print 'import:'
    walk_dir(argv[1], upsert_record)

if __name__ == '__main__':
    main(sys.argv[1:])
