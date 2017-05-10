#/bin/env bash

SQL=$( cat <<- EOM
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'totem_development'
  AND pid <> pg_backend_pid();
EOM
)
echo $SQL | psql totem_development
