/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var PlaceCreate = require('./components/PlaceCreate');
var LocationManager = require('react-native').NativeModules.TMLocationManager;

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NativeAppEventEmitter,
} = React;

class TotemApp{

    startLocationUpdates(){
        LocationManager.startLocationUpdates({}, function(err, response){
            console.log(`${response}`)
        })
        NativeAppEventEmitter.addListener(
              LocationManager.locationUpdatesEventChannel,
                (locationUpdate) => console.log(locationUpdate)
        );

    }
}

var Totem = React.createClass({
  componentDidMount: function(){
      this.app = new TotemApp();
      this.app.startLocationUpdates();
  },
  render: function() {
    return (
        <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
            title: 'Place Finder',
            component: PlaceCreate,
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
