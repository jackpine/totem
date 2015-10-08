var React = require('react-native');
var LocationManager = React.NativeModules.TMLocationManager;
var PlaceCreate = require('./PlaceCreate');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var TotemConstants = require('../constants/TotemConstants');
var ActionTypes = TotemConstants.ActionTypes;
var LocationUpdateAction = require('../actions/LocationUpdateAction');

var {
  StyleSheet,
  NativeAppEventEmitter,
} = React;

class TotemApp{

    startLocationUpdates(){
        LocationManager.startLocationUpdates({}, function(err, response){
            console.log(`${response}`)
        })
        NativeAppEventEmitter.addListener(LocationManager.locationUpdatesEventChannel,
                                          function(locationUpdate){
                                              LocationUpdateAction.createLocationUpdate(locationUpdate)
                                          });
    }
}

var Totem = React.createClass({
  componentDidMount: function(){
      this.app = new TotemApp();
      this.app.startLocationUpdates();
  },
  render: function() {
      console.log('calling render in top level component')
    return (
        <React.NavigatorIOS
        style={styles.container}
        initialRoute={{
            title: 'Place Create',
            component: PlaceCreate,
        }}/>
    );
  },

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

module.exports = Totem;
