#!/usr/bin/env bash
set -x
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TASK=$1
if [ -z $TASK ]
then
  echo "missing a task arg!"
  exit 1
fi

virtualenv -p `which python` $DIR/.venv/ > /dev/null
$DIR/.venv/bin/pip install -r $DIR/requirements.txt > /dev/null


# pass a slice of args
exec $DIR/.venv/bin/python2.7 $DIR/wof_data.py ${TASK} ${@:2}
