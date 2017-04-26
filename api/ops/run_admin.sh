

function usage {
  cat <<EOS
Usage: ./run_admin.sh <connection-string>
 e.g.: ./run_admin.sh root@api.totem-app.com
EOS
}

function launch_admin {
set -x
  docker run --rm -t -i \
    --link totem-db:db \
    -e DB_URL=postgres://postgres@db/totem \
    -e RAILS_ENV=production \
    --network="ops_default" \
    -v $(readlink -f $SSH_AUTH_SOCK):/ssh-agent -e SSH_AUTH_SOCK=/ssh-agent \
    -v /root:/root/work_dir \
    totem-admin /bin/bash
}

if [ "$#" == 1 ]
then
  SSH_OPTS=$1
  ENVIRONMENT=production

  echo "launching admin! (are your ssh keys added to your agent?)"
  ssh -t -A $SSH_OPTS "$(typeset -f); launch_admin"
else
  usage
  exit 1
fi
