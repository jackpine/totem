#!/usr/bin/env bash
set -e
set -x

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

. $DIR/docker_machine.sh
ensure_docker_machine

$DIR/_build_docker_api.sh
$DIR/_build_docker_admin.sh
