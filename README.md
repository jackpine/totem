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


First install nvm and make sure that you have a recent node.
-----------------------------------------------------------

For the Javascript side of things I'm using node 4 with [https://github.com/creationix/nvm](nvm)

    $ node --version
    v4.1.1

Install the node deps. In the repo's root directory:

    $ npm install

I'm using node 4.1.1 (but anything recent-ish should work. And I'm just
starting out with npm3 (grr, npm!).

install watchman to watch for file changes
------------------------------------------

React native does hot code reloading, so to watch for changes in the
files:

    $ brew install watchman

or if you already have watchman installed:

    $ brew upgrade watchman


start the react packager
-------------------------

Optionally, you can:

    $ npm start

This will start the react packager up. The packager is a service that
provides the app (running on the device or simulator) with the JS code
for basic app functionality. This is used in development.
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

tests
-----

right now, all we have are some rspecs in the api

    $ cd api && be rspec spec/

and some jest unit tests:

    $ npm test

calabash end-to-end tests are WIP

eslint for es6 and jsx in vim
-----------------------------

To set up vim for linting, I've added the following to my janus
vimrc.after:

```
let g:syntastic_javascript_checkers = ['eslint']
```

To configure eslint, babel-eslint, eslint-plugin-react I've set up a
`.eslintrc` file that kills a few of the react rules and sets up a
global strict mode. You can find it in the root of this repo.
