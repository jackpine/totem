#!/bin/sh
set -x

docker run --name totem-db \
  -d mdillon/postgis:9.4
