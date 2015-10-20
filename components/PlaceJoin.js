'use strict';

var React = require('react-native');
var DebugLocation = require('./DebugLocation');
var PlaceList = require('./PlaceList');

var {
    StyleSheet,
    Text,
    TextInput,
    View,
    ListView,
} = React;


var PlaceCreate = React.createClass({
    render: function() {

        var locationDebugInfo = <DebugLocation location={this.props.location}/>

        return (
          <View>
            <Text>Join one of the following places</Text>
            <PlaceList
            nearbyPlaces= { this.props.nearbyPlaces }
            />
            </View>
        );
    },
});

module.exports = PlaceCreate;

