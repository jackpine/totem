#!/bin/bash

IP_ADDRESS=$1
USER=$2
MACHINE_NAME=$3

docker-machine create --driver generic --generic-ip-address=$IP_ADDRESS  --generic-ssh-user=$USER $MACHINE_NAME
