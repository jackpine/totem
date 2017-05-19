#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
. $DIR/docker_machine.sh

ensure_docker_machine

docker pull registry.gitlab.com/vevang/totem-api/totem-api
docker pull registry.gitlab.com/vevang/totem-api/totem-admin

docker tag registry.gitlab.com/vevang/totem-api/totem-api totem-api
docker tag registry.gitlab.com/vevang/totem-api/totem-admin totem-admin
