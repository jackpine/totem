'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');
var { Icon, } = require('react-native-icons');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    TouchableHighlight
} = React;


var PlaceJoin = React.createClass({
    statics: {
        navBar: function(){
            var leftButton = function(){};
            var rightButton = function(){
                return (<TouchableHighlight style={styles.placeCreateWrapper} onPress={() => console.log('foo') }>
                    <Icon
                        name='fontawesome|plus'
                        size={20}
                        color='black'
                        style={styles.placeCreateButton} />
                </TouchableHighlight>)
            };
            return (
                <NavigationBar 
                    leftButton={ leftButton }
                    rightButton={ rightButton }
                    />
            );
        }
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
          <View style={styles.listWrapper}>
            {locationDebugInfo}
            <PlaceList
              nearbyPlaces= { this.props.nearbyPlaces }
            />
          </View>
        );
    },
    onPressCreatePlace: function(){
      console.log('create a place!')
    }
});
var styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  },
  joinInstructions: {

  },
  placeCreateWrapper: {
    height: 28,
    width: 28
  },
  placeCreateButton: {
    height: 28,
    width: 28
  },
  listWrapper: {
    flex: 1
  }
}
                              )

module.exports = PlaceJoin;
