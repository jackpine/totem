```
  _______ ____ _______ ______ __  __
 |__   __/ __ \__   __|  ____|  \/  |
    | | | |  | | | |  | |__  | \  / |
    | | | |  | | | |  |  __| | |\/| |
    | | | |__| | | |  | |____| |  | |
    |_|  \____/  |_|  |______|_|  |_|
```

introduction
============

Totem is a [React Native](https://facebook.github.io/react-native/releases/next/) app, a hybrid of ObjectiveC
(iOS) and javascript (NodeJS).

quickstart
==========

For the Javascript side of things I'm using:
- node 4 w/NVM: https://github.com/creationix/nvm

First install nvm and make sure that you have a recent node.
-----------------------------------------------------------

    $ node --version
    v4.1.1

Install the node deps. In this directory:

    $ npm install

I'm using node 4.1.1 (but anything recent-ish should work. And I'm just
starting out with npm3 (grr, npm!).

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

Optionally, you can:

    $ npm start

This will start the react packager up. The packager is a service that
provides the app (running on the device or simulator) with the JS code
that provides the basic app functionality. This is used in development.
For production releases, we take a snapshot of the JS, and [bundle and minify](https://github.com/jackpine/totem/blob/master/ios/main.jsbundle)
it.

Note that XCode will start the packager automatically for you, so I'm noting this
just so that you know this is an essential part of the application
architecture.


Build the App
-----------

In Xcode, open the Totem.xcodeproj file from the ios directort. This
opens the project up in apple's flagship IDE. There you can start the
process of building (⌘ B) or running the app (⌘ R)


The apple build system is a little arcane, so be aware of:

- Target: influence linking and overall build process)
- Scheme: collection of build parameters for a target
- Build Configuration: Main parameter for branching build structure

Run the App / API setup
-----------------------

OK, now we should be able to run the app. Look in `api/README` for
information on how to set up the API.

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
