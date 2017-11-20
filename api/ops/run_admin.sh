

function usage {
  cat <<EOS
Usage: ./run_admin.sh <connection-string>
 e.g.: ./run_admin.sh root@api.totem-app.com
EOS
}

function launch_admin {
  set -x
  set -e 
  if [  -n "$1" ]
  then
    COMMAND=${@:1}
  else
    COMMAND='/bin/bash'
  fi
  docker run --rm \
    -it \
    --link totem-db:db \
    -e DB_URL=postgres://postgres@db/totem \
    -e RAILS_ENV=production \
    --network="ops_default" \
    -v $(readlink -f $SSH_AUTH_SOCK):/ssh-agent -e SSH_AUTH_SOCK=/ssh-agent \
    -v /totem_work:/root/work_dir \
    -v ~/.bash_history:/root/.bash_history \
    -v ~/.psql_history:/root/.psql_history \
    totem-admin bash -c "$COMMAND"
}

if [ "$#" == 1 ] || [ "$#" == 2 ]
then
  SSH_OPTS=$1
  COMMAND=$2
  echo $COMMAND
  ENVIRONMENT=production

  echo "launching admin! (are your ssh keys added to your agent?)"
  ssh -t -A $SSH_OPTS "$(typeset -f); launch_admin \"$COMMAND\""
else
  usage
  exit 1
fi
