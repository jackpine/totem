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
    docker run --name totem-db -p 127.0.0.1:5432:5432 -d mdillon/postgis:9.5
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
    -d -p 80:80 \
    totem-api

  docker cp production_env totem-api:/home/app/totem-api/.env

  echo "done."
  echo ""
  echo "run the admin shell: './run-admin.sh' "

##  echo "Copying config."
##  docker exec -i totem bash -c "cat - > ~app/totem/.env" < ~/totem/ops/secrets/totem-$ENVIRONMENT-api.env

  #echo "Restarting container."
  #docker stop totem
  #docker start totem
}

if [ "$#" == 1 ]
then
  SSH_OPTS=$1
  ENVIRONMENT=production

  scp $DIR/production_env ${SSH_OPTS}:

  echo "Remote deploying ${ENVIRONMENT} to ${SSH_OPTS}."
  ssh $SSH_OPTS "$(typeset -f); provision $ENVIRONMENT"
else
  usage
  exit 1
fi
