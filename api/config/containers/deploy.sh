#!/usr/bin/env bash

BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)
. $BIN_DIR/database/_container_funcs.sh
. $BIN_DIR/api/_container_funcs.sh

function usage {
  cat <<EOS
Usage: ./deploy <connection-string> <environment>
 e.g.: ./deploy core@api-staging.totem-app.com staging
EOS
}

function provision {

  BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)

  ENVIRONMENT=$1
  CONFIG="${*:2}"

  if [ -z $ENVIRONMENT ]
  then
    usage
    exit 1
  fi
  DEPLOY_ENVIRONMENTS=="development staging production"
  if ! [[ $DEPLOY_ENVIRONMENTS =~ $ENVIRONMENT ]]; then
    echo "Your environment must be in '$DEPLOY_ENVIRONMENTS'"
    exit 2
  fi

  docker ps -a | grep totem-db > /dev/null
  DB_ALREADY_DEPLOYED=$?
  if [ $DB_ALREADY_DEPLOYED -eq 0 ]
  then
    echo "Database previously deployed. $DB_ALREADY_DEPLOYED"
    start_database > /dev/null
  else
    echo "Deploying new database container."
    run_database > /dev/null
  fi

  echo "Pulling latest containers."
  docker pull svevang/totem-api > /dev/null

  echo "Removing any pre-existing api container."
  destroy_api > /dev/null

  echo "Running new api container."
  run_api $ENVIRONMENT $CONFIG > /dev/null

  if [ $DB_ALREADY_DEPLOYED -ne 0 ]
  then
    echo ""
    echo "******"
    echo "NEW DB"
    echo "at this point you should run rake db:setup and import the seed data for the db"
  fi


#  echo "Copying config."
#  docker exec -i open-analytics bash -c "cat - > ~app/open-analytics/.env" < ~/open-analytics/ops/secrets/open-analytics-$ENVIRONMENT-api.env

}

if [ "$#" == 2 ]
then
  HOST=$1
  ENVIRONMENT=$2

  CONFIG=''
  while IFS='' read -r line || [[ -n "$line" ]]; do 
    CONFIG+="-e ${line} "
  done < totem-api-$ENVIRONMENT.env

  echo "Remote deploying ${ENVIRONMENT} to ${HOST}."

  #echo "$(typeset -f); provision $ENVIRONMENT"
  ssh -t $1 "$(typeset -f); provision $ENVIRONMENT $CONFIG"
else
  usage
  exit 1
fi
