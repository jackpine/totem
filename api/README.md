```
  _______ ____ _______ ______ __  __
 |__   __/ __ \__   __|  ____|  \/  |
    | | | |  | | | |  | |__  | \  / |
    | | | |  | | | |  |  __| | |\/| |
    | | | |__| | | |  | |____| |  | |
    |_|  \____/  |_|  |______|_|  |_|

```

quickstart
==========

This api (under api/ in the main git repo) is a Ruby on Rails application.

The basic setup is as follows:

1) Run bundler to set up the Gems for the project:

    $ bundle

2) Create the database

    bundle exec rake db:create db:structure:load

It's possible that this is trickiest step, making sure that you have
postgresql installed (I use homebrew on MacOS to install postgresql).
It's worth it to have such an awesome database!


3) install some test data. 

I'm using the whosoffirst dataset to populate the 'world' with places:

    https://github.com/whosonfirst/whosonfirst-data


It's a big dataset! And git (and github!) doesn't really like all these little files.
So to speed up the downloading process, it's faster to grab the zipfile
of the master branch (Download Zip on the right). Download that and
unzip, noting the path to the data dir (e.g. `/some/path/whosonfirst-master/data` )

Then run the data import rake task:

    $ WOF=/some/path/whosonfirst-master/data  bundle exec rake totem:import_wof_data

This should (after running for 10-20 minutes) import all the data needed
to 'find places' near you.

4) run the test server:

    ./bin/rails s

OPS
---
There are a set of tools for managing the running api. First you should
```
$ cd ops/
```

Then use docker machine to bring the containers up:

```
# in the case of local development, just keep this as the 'default'
# machine
$ eval $(docker-machine env totem-api)

# ensure that the containers are present and proper aliases are created
 ./ops/pull


 docker-compose up
```

Once the machine is up you can access the admin shell as follow:

```
 ./run_admin.sh <user>@<host>
```

For new api hosts, at this point you can set up the systemd service
files to ensure that the services are brought up on boot

```
  cp docker-container@.service /etc/systemd/system

  systemctl --system daemon-reload

  systemctl start docker-container@totem-db.service
  systemctl start docker-container@totem-api.service

  systemctl enable docker-container@totem-db.service
  systemctl enable docker-container@totem-api.service

```

BUILDING
--------
Build the docker containers, for both api and admin, then push the
result to the gitlab registry:

```
 ./ops/build_docker.sh
```

