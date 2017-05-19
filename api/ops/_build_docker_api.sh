#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

. $DIR/docker_machine.sh
ensure_docker_machine

docker build --tag="registry.gitlab.com/vevang/totem-api/totem-api" $DIR/..

docker push registry.gitlab.com/vevang/totem-api/totem-api

docker tag registry.gitlab.com/vevang/totem-api/totem-api totem-api
