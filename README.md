totem-app quickstart
====================

There is a good quickstart doc on react's site, but here is an
abbreviated version:

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
