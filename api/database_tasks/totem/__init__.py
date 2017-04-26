import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, Table, MetaData, Column
from geoalchemy2 import Geometry

PLACE_CATEGORIES =   {
    'empire': 1,
    'continent': 1,
    'country': 2,
    'region': 3,
    'localadmin': 4,
    'county': 4,
    'locality': 5,
    'neighbourhood': 6,
    'campus': 6,
    'neighborhood': 6,
    'microhood': 6,
}


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
            autoload=True,
            autoload_with=engine,
            extend_existing=True);

    return places

