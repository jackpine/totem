#!/usr/bin/env bash
BIN_DIR=$(cd `dirname "${BASH_SOURCE[0]}"` && pwd)

. $BIN_DIR/_container_funcs.sh

shell_database
