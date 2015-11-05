#!/usr/bin/env bash

destroy_database(){
  stop_database
  docker rm totem-db
}

run_database(){
  docker run --name totem-db \
    -d mdillon/postgis:9.4
}

shell_database(){
  docker exec -ti totem-db /bin/bash
}

start_database(){
  docker start totem-db
}

stop_database(){
  docker stop totem-db
}
