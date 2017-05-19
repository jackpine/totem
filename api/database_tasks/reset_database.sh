#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

$DIR/close_database_connections.sh
dropdb totem_development; createdb totem_development -T totem_template;
#say 'database reset is done' &
