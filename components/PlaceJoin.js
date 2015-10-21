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
        navBar: function(nav){
            var leftButton = function(){};
            var rightButton = function(){
                return (<TouchableHighlight style={styles.placeCreateButton} onPress={function(){ nav.push({path: 'place_create'}) }}>
                    <View style={styles.placeCreateButton}>
                    <Icon
                        name='fontawesome|plus-circle'
                        size={30}
                        color='#337ab7'
                        style={styles.placeCreateIcon} />
                </View>
                </TouchableHighlight>)
            };
            var titleConfig = {
                title: "Where are you?"
            }
            return (
                <NavigationBar 
                    title={titleConfig}
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
  placeCreateButton: {
    width: 60,
    flexDirection: "row",
    paddingLeft: 5,
  },
  placeCreateIcon: {
    height: 30,
    width: 30,
  },
  listWrapper: {
    flex: 1
  }
});

module.exports = PlaceJoin;
