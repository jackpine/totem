import os
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy import create_engine, Table, MetaData, Column
from geoalchemy2 import Geometry

PLACE_CATEGORIES =   {
'continent': 1 ,
'ocean': 1, # added
'empire': 1 ,
'country': 2,
'macroregion': 2,
'region': 3 ,
'marinearea': 3, #added
'macrocounty': 3,
'county': 4,
'dependency': 4,
'borough': 5, # added
'metro': 5 ,
'locality': 5,
'localadmin': 5,
'macrohood': 5,
'neighbourhood': 6,
'microhood': 6,
'campus': 6,
'disputed': 6,
'building': 6,
'address': 6,
'venue': 6,
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

