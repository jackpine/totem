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

build the docker container:

```
./ops/build_docker.sh totem-app
./ops/deploy.sh core@api.totem-app.com production
```

I'm hacking docker machine, using it as a way to _distrubute_ docker
images. It's a little backwards, but what the hey!


