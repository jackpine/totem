#!/usr/bin/env bash

function ensure_docker_machine {

  MACHINE=`docker-machine active`

  echo "Docker machine:    ${MACHINE}"
  echo ""

  if [ "$MACHINE" == "totem-api" ]; then
    echo "**PRODUCTION**"
    echo ""
    sleep 3
  fi

}
