#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
MACHINE=$1

if [ -z "$MACHINE" ]; then
  MACHINE="default";
fi

echo "building on docker machine: ${MACHINE}"

# something like:
# docker-machine create -d generic --generic-ip-address 159.203.68.122 --generic-ssh-user core totem-api
set -x

eval $(docker-machine env $MACHINE)
docker build --tag="totem-api" $DIR/..
docker build --tag="totem-admin" -f $DIR/../Dockerfile.admin $DIR/..

