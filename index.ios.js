/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var PlacesNearby = require('./PlacesNearby');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Totem = React.createClass({
  render: function() {
    return (
        <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
            title: 'Place Finder',
            component: PlacesNearby,
        }}/>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 80,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Totem', () => Totem);
