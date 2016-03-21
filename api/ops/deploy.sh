#!/usr/bin/env bash
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TAG="totem-api"

function usage {
  cat <<EOS
Usage: ./deploy.sh <connection-string>
 e.g.: ./deploy.sh root@api.totem-app.com
EOS
}

function provision {

  BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)
  echo "local dir: $BIN_DIR"

  ENVIRONMENT=$1

  if [ -z $ENVIRONMENT ]
  then
    usage
    exit 1
  fi

  docker ps -a | grep totem-db > /dev/null
  DB_ALREADY_DEPLOYED=$?
  if [ $DB_ALREADY_DEPLOYED -eq 0 ]
  then
    echo "Database previously deployed. $DB_ALREADY_DEPLOYED"
    docker start totem-db
  else
    echo "Deploying new database container."
    docker run --name totem-db -d mdillon/postgis:9.5
  fi

  echo "Removing any pre-existing api container."
  docker stop totem-api > /dev/null
  docker rm -f totem-api > /dev/null

  echo "Starting new api container."
  docker run  \
    --name totem-api \
    --link totem-db:db \
    -e DB_URL=postgres://postgres@db/totem \
    -e RAILS_ENV=production \
    -d -p 3000:3000 \
    totem-api

##  echo "Copying config."
##  docker exec -i totem bash -c "cat - > ~app/totem/.env" < ~/totem/ops/secrets/totem-$ENVIRONMENT-api.env

  #echo "Restarting container."
  #docker stop totem
  #docker start totem
}

if [ "$#" == 1 ]
then
  HOST=$1
  ENVIRONMENT=production

  echo "Remote deploying ${ENVIRONMENT} to ${HOST}."
  ssh $1 "$(typeset -f); provision $ENVIRONMENT"
else
  usage
  exit 1
fi
