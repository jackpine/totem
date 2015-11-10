#!/usr/bin/env bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

TASK=$1
if [ -z $TASK ]
then
  echo "missing a task arg!"
  exit 1
fi

virtualenv $DIR/.venv/ > /dev/null
$DIR/.venv/bin/pip install -r $DIR/requirements.txt > /dev/null

# pass a slice of args
exec $DIR/.venv/bin/python $DIR/${TASK}.py ${@:2}
