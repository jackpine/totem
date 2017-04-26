import sys
from subprocess import call

import IPython

from totem import get_places_table
from totem import PLACE_CATEGORIES
from totem.whos_on_first import totem_data_from_wof
from totem.whos_on_first import should_skip
from totem.whos_on_first import walk_dir


def main(argv):

    places = get_places_table()

    def insert_record(wof_json, path):
        try:
            data = totem_data_from_wof(wof_json)
            places.insert(data).execute()
        except Exception, e:
            print "Skipping:", path, wof_json["properties"]["wof:name"]
            print e

    walk_dir(argv[0], insert_record)
if __name__ == '__main__':
    print "wowowow"
    main(sys.argv[1:])
