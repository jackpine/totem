totem-app quickstart
====================

There is a good quickstart doc on react's site, but here is an
abbreviated version:

I'm using:
node 4.3
npm 3

install watchman to watch for file changes
------------------------------------------

    
    $ brew install watchman

or if you already have watchman installed:

    $ brew upgrade watchman


install the cli react tool
--------------------------

    $ npm install -g react-native-cli

start the react packager
-------------------------

    $ npm install
    $ npm start

Run the App
-----------
In Xcode, punch ⌘R

Develop and Debug the App
-------------------------

Once the app has loaded, use ⌘R to reload and ⌘D to launch the
debugger in Chrome (you may need to install an extension)

totem-api
=========

make sure to seed the database with the example place data:

    $ be rake totem:import_flickr_data

tests
=====

right now, all we have are some rspecs in the api

    $ cd api && be rspec spec/

and some jest unit tests:

    $ npm test

Adhoc builds
============

Note that there is a new build phase script that bundles the react
javascript when building for the Adhoc configuration. This is so that
you don't forget to bundle the JS when distributing the app.  However,
this script is working intermittently.

In the case of building AdHoc configurations, make sure to `cd ios/bin;
./react-bundle-minify` by hand first


eslint for es6 and jsx in vim
=============================

To set up vim for linting, I've added the following to my janus
vimrc.after:

```
let g:syntastic_javascript_checkers = ['eslint']
```

To configure eslint, babel-eslint, eslint-plugin-react I've set up a
`.eslintrc` file that kills a few of the react rules and sets up a
global strict mode. You can find it in the root of this repo.
