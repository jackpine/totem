'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');
var NavigationBar = require('./NavigationBar');
var { Icon } = require('react-native-icons');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
    TouchableHighlight
} = React;


var PlaceJoin = React.createClass({
    renderNavBar: function(){
        var self = this;
        var leftButton = function(){};
        var rightButton = function(){
            return (
                <TouchableHighlight 
                    onPress={(place)=>self.props.navigator.push({path: 'place_create'})}
                    style={styles.placeCreateButton}
                >
                    <View style={styles.placeCreateButton}>
                        <Icon
                            color={'#337ab7'}
                            name={'fontawesome|plus-circle'}
                            size={30}
                            style={styles.placeCreateIcon}
                        />
                    </View>
                </TouchableHighlight>)
        };
        return (
            <NavigationBar
                leftButton={leftButton}
                rightButton={rightButton}
                navigator={this.props.navigator}
                title={'Where are you?'}
            />
        );
    },
    handleRowPress: function(place){
        this.props.navigator.push({path: 'place', passProps:{name: place}});
    },
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
            <View style={styles.listWrapper}>
                {this.renderNavBar()}
                {locationDebugInfo}
                <PlaceList
                    nearbyPlaces= {this.props.nearbyPlaces}
                    onRowPress={this.handleRowPress}
                />
            </View>
        );
    },
});

var styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
  },
  placeCreateButton: {
    width: 60,
    flexDirection: 'row',
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
