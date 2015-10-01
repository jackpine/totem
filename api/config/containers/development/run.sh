#!/usr/bin/env bash
set -x

BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)
APP_ROOT=$BIN_DIR/../../../

docker run --name totem-api \
  -p 80:80 \
  --link totem-db:totem-db \
  -e PASSENGER_APP_ENV=development \
  -d svevang/totem-api
