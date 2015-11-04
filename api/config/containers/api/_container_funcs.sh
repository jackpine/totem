#!/usr/bin/env bash
API_BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)

build_api(){
  docker build -t svevang/totem-api $API_BIN_DIR/../../../
}

destroy_api(){
  stop_api
  docker rm totem-api
}

run_shared_folder_api(){
  APP_ROOT=$API_BIN_DIR/../../../

  cat << EOF
   note that on boot2docker i had to create a shared folder as follows:

     $ boot2docker halt
     $ vboxmanage sharedfolder add "boot2docker-vm" --name totem-api --hostpath /Users/sam/src/totem/api/
     $ boot2docker up
     $ boot2docker ssh "sudo modprobe vboxsf && sudo mkdir /totem-api && sudo mount -v -t vboxsf  -o uid=9999,gid=9999 totem-api /totem-api"

EOF
  docker run --name totem-api \
    -p 80:80 \
    -v /totem-api:/home/app/totem-api \
    --link totem-db:totem-db \
    -e PASSENGER_APP_ENV=development \
    -d svevang/totem-api
}

run_api(){

  DEPLOY_ENVIRONMENT=$1
  ENV_CONFIG="${@:2}"

  if [[ $DEPLOY_ENVIRONMENT = "staging" ]]; then
    PASSENGER_APP_ENVIRONMENT="production"
  else
    PASSENGER_APP_ENVIRONMENT=$DEPLOY_ENVIRONMENT
  fi

  docker run --name totem-api \
    -p 80:80 \
    --link totem-db:totem-db \
    -e PASSENGER_APP_ENV=$PASSENGER_APP_ENVIRONMENT $ENV_CONFIG \
    -d svevang/totem-api
}

shell_api(){
  docker exec -ti totem-api /bin/bash
}

start_api(){
  docker start totem-api
}

stop_api(){
  docker stop totem-api
}
