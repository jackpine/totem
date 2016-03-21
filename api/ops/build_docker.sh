#!/usr/bin/env bash

usage(){
  echo "specify a docker machine as arg:"
  echo "usage: ./build_docker {totem_api|default}"

}

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TAG="totem-api"
MACHINE=$1

if [ -z "$MACHINE" ]; then
  MACHINE="default";
fi

# something like:
# docker-machine create -d generic --generic-ip-address 159.203.68.122 --generic-ssh-user core totem-api
eval $(docker-machine env $MACHINE)
docker build --tag="$TAG" $DIR/..

